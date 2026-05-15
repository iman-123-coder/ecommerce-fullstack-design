const express = require('express');
const cors = require('cors');
require('dotenv').config();

console.log('ENV CHECK:', process.env.SUPABASE_URL, process.env.JWT_SECRET);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Load routes AFTER env check
try {
  const productRoutes = require('./routes/productRoutes');
  const authRoutes = require('./routes/authRoutes');
  const cartRoutes = require('./routes/cartRoutes');
  
  app.use('/api/products', productRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/cart', cartRoutes);
} catch(err) {
  console.error('ROUTE ERROR:', err.message);
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});