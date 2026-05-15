const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

router.get('/', authenticateToken, async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  try {
    const { data, error } = await supabase.from('cart').select(`id, quantity, product_id, products (id, name, price, image, category, discount)`).eq('user_id', req.user.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.post('/', authenticateToken, async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { product_id, quantity = 1 } = req.body;
  try {
    const { data: existing } = await supabase.from('cart').select('id, quantity').eq('user_id', req.user.id).eq('product_id', product_id).single();
    if (existing) {
      const { data, error } = await supabase.from('cart').update({ quantity: existing.quantity + quantity }).eq('id', existing.id).select();
      if (error) return res.status(400).json({ error: error.message });
      return res.json(data);
    }
    const { data, error } = await supabase.from('cart').insert({ user_id: req.user.id, product_id, quantity }).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.patch('/:id', authenticateToken, async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { quantity } = req.body;
  try {
    if (quantity < 1) {
      const { error } = await supabase.from('cart').delete().eq('id', req.params.id).eq('user_id', req.user.id);
      if (error) return res.status(400).json({ error: error.message });
      return res.json({ deleted: true });
    }
    const { data, error } = await supabase.from('cart').update({ quantity }).eq('id', req.params.id).eq('user_id', req.user.id).select();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/:id', authenticateToken, async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  try {
    const { error } = await supabase.from('cart').delete().eq('id', req.params.id).eq('user_id', req.user.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.delete('/', authenticateToken, async (req, res) => {
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  try {
    const { error } = await supabase.from('cart').delete().eq('user_id', req.user.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;