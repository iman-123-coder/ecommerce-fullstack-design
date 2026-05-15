import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Cart = () => {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]')
      const formatted = stored.map(item => ({
        id: item.id,
        quantity: item.quantity,
        products: item
      }))
      setCart(formatted)
      setLoading(false)
      return
    }
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCart(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (cartItemId, newQty) => {
    if (!token) {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]')
      if (newQty < 1) {
        const updated = stored.filter(i => i.id !== cartItemId)
        localStorage.setItem('cart', JSON.stringify(updated))
        setCart(updated.map(i => ({ id: i.id, quantity: i.quantity, products: i })))
      } else {
        const updated = stored.map(i => i.id === cartItemId ? { ...i, quantity: newQty } : i)
        localStorage.setItem('cart', JSON.stringify(updated))
        setCart(updated.map(i => ({ id: i.id, quantity: i.quantity, products: i })))
      }
      return
    }
    try {
      await axios.patch(`http://localhost:5000/api/cart/${cartItemId}`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (newQty < 1) {
        setCart(prev => prev.filter(i => i.id !== cartItemId))
      } else {
        setCart(prev => prev.map(i => i.id === cartItemId ? { ...i, quantity: newQty } : i))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const removeItem = async (cartItemId) => {
    if (!token) {
      const stored = JSON.parse(localStorage.getItem('cart') || '[]')
      const updated = stored.filter(i => i.id !== cartItemId)
      localStorage.setItem('cart', JSON.stringify(updated))
      setCart(prev => prev.filter(i => i.id !== cartItemId))
      return
    }
    try {
      await axios.delete(`http://localhost:5000/api/cart/${cartItemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCart(prev => prev.filter(i => i.id !== cartItemId))
    } catch (err) {
      console.error(err)
    }
  }

  const clearCart = async () => {
    if (!token) {
      localStorage.removeItem('cart')
      setCart([])
      return
    }
    try {
      await axios.delete('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCart([])
    } catch (err) {
      console.error(err)
    }
  }

  const applyCoupon = () => {
    if (coupon.trim().toLowerCase() === 'save10') {
      setCouponApplied(true)
    } else {
      alert('Invalid coupon. Try: SAVE10')
    }
  }

  const getProduct = (item) => item.products || item
  const getPrice = (item) => Number(getProduct(item)?.price) || 0
  const getName = (item) => getProduct(item)?.name || 'Product'
  const getImage = (item) => getProduct(item)?.image || ''
  const getCategory = (item) => getProduct(item)?.category || ''
  const getDiscount = (item) => getProduct(item)?.discount || 0

  const subtotal = cart.reduce((sum, item) => sum + getPrice(item) * item.quantity, 0)
  const discountAmt = couponApplied ? subtotal * 0.1 : 0
  const tax = subtotal * 0.1
  const shipping = subtotal > 100 ? 0 : 10
  const total = subtotal - discountAmt + tax + shipping
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  const savedItems = [
    { id: 1, name: 'GoPro HERO6 4K Action Camera - Black', price: 99.50, img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300' },
    { id: 2, name: 'GoPro HERO6 4K Action Camera - Black', price: 99.50, img: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=300' },
    { id: 3, name: 'GoPro HERO6 4K Action Camera - Black', price: 99.50, img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300' },
    { id: 4, name: 'GoPro HERO6 4K Action Camera - Black', price: 99.50, img: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── DESKTOP NAVBAR ── */}
      <nav className="hidden md:block bg-white border-b py-3 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-blue-600 text-white p-2 rounded text-sm font-bold">B</div>
            <span className="font-bold text-blue-600 text-xl">Brand</span>
          </Link>
          <div className="flex flex-1 border border-gray-300 rounded overflow-hidden">
            <input className="flex-1 px-4 py-2 outline-none text-sm" placeholder="Search" />
            <select className="border-l px-3 py-2 text-sm text-gray-600 outline-none bg-gray-50">
              <option>All category</option>
            </select>
            <Link to="/products" className="bg-blue-600 text-white px-6 py-2 text-sm hover:bg-blue-700 font-medium">Search</Link>
          </div>
          <div className="flex items-center gap-6 shrink-0 text-gray-600">
            <Link to="/login" className="flex flex-col items-center gap-0.5 hover:text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span className="text-xs">Profile</span>
            </Link>
            <Link to="#" className="flex flex-col items-center gap-0.5 hover:text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
              <span className="text-xs">Message</span>
            </Link>
            <Link to="#" className="flex flex-col items-center gap-0.5 hover:text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <span className="text-xs">Orders</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center gap-0.5 hover:text-blue-600 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center leading-none">{totalItems}</span>
              )}
              <span className="text-xs">My cart</span>
            </Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex items-center gap-6 mt-2 pt-2 border-t border-gray-100 text-sm text-gray-700">
          <button className="flex items-center gap-1.5 font-semibold hover:text-blue-600">☰ All category</button>
          <Link to="#" className="hover:text-blue-600">Hot offers</Link>
          <Link to="#" className="hover:text-blue-600">Gift boxes</Link>
          <Link to="#" className="hover:text-blue-600">Projects</Link>
          <Link to="#" className="hover:text-blue-600">Menu item</Link>
          <span className="hover:text-blue-600 cursor-pointer">Help ▾</span>
          <div className="ml-auto flex items-center gap-5 text-gray-500 text-xs">
            <span>English, USD ▾</span>
            <span>Ship to 🇩🇪 ▾</span>
          </div>
        </div>
      </nav>

      {/* ── MOBILE NAVBAR ── */}
      <nav className="md:hidden bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-3 py-2.5">
          {/* Hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1.5 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 font-bold text-blue-600 text-lg">
            <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">B</div>
            Brand
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="p-1.5 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
            <Link to="/cart" className="p-1.5 text-blue-600 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center leading-none">{totalItems}</span>
              )}
            </Link>
            <Link to="/login" className="p-1.5 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="px-3 pb-2.5 flex gap-2">
            <input
              autoFocus
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              placeholder="Search products..."
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Go</button>
          </div>
        )}

        {/* Mobile slide-out menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-xl z-50 border-t border-gray-100">
            <div className="p-4">
              <div className="flex gap-2 mb-4">
                <Link to="/login" className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg text-sm font-medium text-center">Login</Link>
                <Link to="/register" className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium text-center">Register</Link>
              </div>
              {['All category','Hot offers','Gift boxes','Projects','Menu item','Help'].map(item => (
                <button key={item} onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left py-3 px-2 border-b border-gray-100 text-sm text-gray-700 hover:text-blue-600">
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6">

        {/* Not logged in warning */}
        {!token && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 md:px-4 py-3 mb-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-sm">
            <span className="text-yellow-800 text-xs md:text-sm">⚠️ You're not logged in. Cart is saved locally only.</span>
            <Link to="/login" className="bg-yellow-500 text-white px-4 py-1.5 rounded hover:bg-yellow-600 font-medium text-xs md:text-sm whitespace-nowrap">Login to save cart</Link>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400 text-lg">Loading your cart...</div>
        ) : cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-6">Looks like you haven't added anything yet.</p>
            <Link to="/products" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-medium">Start shopping</Link>
          </div>
        ) : (
          <>
            {/* ── DESKTOP layout ── */}
            <div className="hidden md:flex gap-6 items-start">
              {/* Left: Cart items */}
              <div className="flex-1">
                <h2 className="font-semibold text-gray-800 text-lg mb-3">My cart ({totalItems})</h2>

                <div className="bg-white rounded-lg shadow-sm mb-3">
                  {/* Table header */}
                  <div className="grid grid-cols-12 px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Total Price</div>
                  </div>

                  {cart.map(item => (
                    <div key={item.id} className="grid grid-cols-12 items-center px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition">
                      <div className="col-span-6 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                          <img src={getImage(item)} alt={getName(item)} className="w-full h-full object-cover"
                            onError={e => { e.target.src = 'https://via.placeholder.com/64?text=?' }} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{getName(item)}</p>
                          <p className="text-xs text-gray-400 mt-0.5">Size: medium, Color: blue, Material: Plastic</p>
                          <p className="text-xs text-gray-400">Seller: {getCategory(item) || 'Best factory LLC'}</p>
                          {getDiscount(item) > 0 && (
                            <span className="text-xs text-red-500 font-medium">-{getDiscount(item)}%</span>
                          )}
                          <div className="flex gap-3 mt-1.5">
                            <button onClick={() => removeItem(item.id)} className="text-xs text-red-400 hover:text-red-600 hover:underline">Remove</button>
                            <button className="text-xs text-blue-500 hover:text-blue-700 hover:underline">Save for later</button>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2 text-center font-semibold text-gray-800">${getPrice(item).toFixed(2)}</div>
                      <div className="col-span-2 flex items-center justify-center gap-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold">−</button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold">+</button>
                      </div>
                      <div className="col-span-2 flex items-center justify-center">
                        <span className="font-bold text-gray-800">${(getPrice(item) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trust bar */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-3 grid grid-cols-3 divide-x divide-gray-100">
                  {[
                    { icon: '🔒', title: 'Secure payment', sub: 'Have you ever finally just' },
                    { icon: '💬', title: 'Customer support', sub: 'Have you ever finally just' },
                    { icon: '🚚', title: 'Free delivery', sub: 'Have you ever finally just' },
                  ].map(f => (
                    <div key={f.title} className="flex items-center gap-3 px-4 first:pl-0">
                      <span className="text-2xl">{f.icon}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">{f.title}</p>
                        <p className="text-xs text-gray-400">{f.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Back / Remove all */}
                <div className="flex items-center justify-between mb-4">
                  <Link to="/products" className="flex items-center gap-1 text-blue-600 text-sm hover:underline border border-blue-300 px-4 py-1.5 rounded hover:bg-blue-50">
                    ← Back to shop
                  </Link>
                  <button onClick={clearCart} className="text-red-500 text-sm hover:underline border border-red-200 px-4 py-1.5 rounded hover:bg-red-50">
                    Remove all
                  </button>
                </div>

                {/* Saved for later */}
                <div className="bg-white rounded-lg shadow-sm p-5 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Saved for later</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {savedItems.map(s => (
                      <div key={s.id} className="border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition">
                        <img src={s.img} alt={s.name} className="w-full h-32 object-cover" />
                        <div className="p-3">
                          <p className="font-bold text-sm text-gray-800">${s.price.toFixed(2)}</p>
                          <p className="text-xs text-gray-500 leading-snug mt-0.5 line-clamp-2">{s.name}</p>
                          <button className="mt-2 w-full border border-blue-500 text-blue-600 text-xs py-1.5 rounded hover:bg-blue-50 font-medium flex items-center justify-center gap-1">
                            🛒 Move to cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Super discount banner */}
                <div className="rounded-xl p-6 flex items-center justify-between relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)' }}>
                  <div className="text-white z-10">
                    <h3 className="font-bold text-lg">Super discount on more than 100 USD</h3>
                    <p className="text-blue-200 text-sm mt-1">Have you ever finally just write dummy info</p>
                  </div>
                  <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm z-10 shrink-0">
                    Shop now
                  </button>
                </div>
              </div>

              {/* Right: Order Summary sidebar */}
              <div className="w-72 shrink-0 flex flex-col gap-4">
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Have a coupon?</h3>
                  <div className="flex gap-2">
                    <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Add coupon"
                      className="flex-1 border border-gray-200 rounded px-3 py-2 text-sm outline-none focus:border-blue-400" />
                    <button onClick={applyCoupon} className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700">Apply</button>
                  </div>
                  {couponApplied && <p className="text-green-600 text-xs mt-2 font-medium">✓ 10% discount applied!</p>}
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Discount:</span>
                      <span className="text-red-500 font-medium">-${discountAmt.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax:</span>
                      <span className="text-green-600 font-medium">+${tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                      <span>Total:</span>
                      <span className="text-gray-900">${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition text-sm">
                    Checkout
                  </button>
                  <div className="mt-4 text-center">
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/visa.svg" alt="visa" className="h-6 object-contain opacity-70" />
                      <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mastercard.svg" alt="mastercard" className="h-6 object-contain opacity-70" />
                      <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/paypal.svg" alt="paypal" className="h-6 object-contain opacity-70" />
                      <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/applepay.svg" alt="applepay" className="h-6 object-contain opacity-70" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── MOBILE layout ── */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-gray-800 text-base">My cart ({totalItems})</h2>
                <button onClick={clearCart} className="text-red-400 text-xs border border-red-200 px-3 py-1 rounded hover:bg-red-50">
                  Remove all
                </button>
              </div>

              {/* Cart items — card style on mobile */}
              <div className="space-y-3 mb-4">
                {cart.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm p-3 flex gap-3">
                    {/* Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                      <img src={getImage(item)} alt={getName(item)} className="w-full h-full object-cover"
                        onError={e => { e.target.src = 'https://via.placeholder.com/80?text=?' }} />
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug">{getName(item)}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{getCategory(item) || 'Best factory LLC'}</p>
                      {getDiscount(item) > 0 && (
                        <span className="text-xs text-red-500 font-medium">-{getDiscount(item)}%</span>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        {/* Qty controls */}
                        <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg overflow-hidden">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-2.5 py-1 hover:bg-gray-100 text-gray-600 font-bold text-sm">−</button>
                          <span className="px-2 text-sm font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="px-2.5 py-1 hover:bg-gray-100 text-gray-600 font-bold text-sm">+</button>
                        </div>
                        {/* Price */}
                        <span className="font-bold text-gray-800 text-sm">${(getPrice(item) * item.quantity).toFixed(2)}</span>
                      </div>
                      <div className="flex gap-3 mt-1.5">
                        <button onClick={() => removeItem(item.id)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                        <button className="text-xs text-blue-500 hover:text-blue-700">Save for later</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Trust bar */}
              <div className="bg-white rounded-xl shadow-sm p-3 mb-4 grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: '🔒', title: 'Secure' },
                  { icon: '💬', title: 'Support' },
                  { icon: '🚚', title: 'Free Delivery' },
                ].map(f => (
                  <div key={f.title} className="flex flex-col items-center gap-1">
                    <span className="text-xl">{f.icon}</span>
                    <p className="text-xs font-medium text-gray-700">{f.title}</p>
                  </div>
                ))}
              </div>

              {/* Mobile Coupon */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">Have a coupon?</h3>
                <div className="flex gap-2">
                  <input value={coupon} onChange={e => setCoupon(e.target.value)} placeholder="Add coupon"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400" />
                  <button onClick={applyCoupon} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">Apply</button>
                </div>
                {couponApplied && <p className="text-green-600 text-xs mt-2 font-medium">✓ 10% discount applied!</p>}
              </div>

              {/* Mobile Order Summary (collapsible) */}
              <div className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden">
                <button
                  onClick={() => setShowSummary(!showSummary)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800"
                >
                  <span>Order Summary</span>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-bold">${total.toFixed(2)}</span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${showSummary ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </div>
                </button>
                {showSummary && (
                  <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2.5 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal:</span>
                      <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Discount:</span>
                      <span className="text-red-500 font-medium">-${discountAmt.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax:</span>
                      <span className="text-green-600 font-medium">+${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping:</span>
                      <span className={`font-medium ${shipping === 0 ? 'text-green-600' : 'text-gray-800'}`}>
                        {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-base">
                      <span>Total:</span>
                      <span className="text-gray-900">${total.toFixed(2)}</span>
                    </div>
                    {/* Payment icons */}
                    <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                      <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/visa.svg" alt="visa" className="h-5 object-contain opacity-70" />
                      <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mastercard.svg" alt="mastercard" className="h-5 object-contain opacity-70" />
                      <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/paypal.svg" alt="paypal" className="h-5 object-contain opacity-70" />
                      <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/applepay.svg" alt="applepay" className="h-5 object-contain opacity-70" />
                    </div>
                  </div>
                )}
              </div>

              {/* Saved for later — horizontal scroll on mobile */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">Saved for later</h3>
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {savedItems.map(s => (
                    <div key={s.id} className="border border-gray-100 rounded-xl overflow-hidden shrink-0 w-36 hover:shadow-md transition">
                      <img src={s.img} alt={s.name} className="w-full h-24 object-cover" />
                      <div className="p-2">
                        <p className="font-bold text-xs text-gray-800">${s.price.toFixed(2)}</p>
                        <p className="text-xs text-gray-500 leading-snug mt-0.5 line-clamp-2">{s.name}</p>
                        <button className="mt-2 w-full border border-blue-500 text-blue-600 text-xs py-1.5 rounded-lg hover:bg-blue-50 font-medium">
                          🛒 Move to cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Super discount banner — mobile */}
              <div className="rounded-xl p-4 mb-4 flex flex-col gap-3" style={{ background: 'linear-gradient(135deg, #1565c0 0%, #42a5f5 100%)' }}>
                <div className="text-white">
                  <h3 className="font-bold text-sm">Super discount on more than 100 USD</h3>
                  <p className="text-blue-200 text-xs mt-1">Have you ever finally just write dummy info</p>
                </div>
                <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold text-sm w-full">
                  Shop now
                </button>
              </div>

              {/* Back to shop */}
              <div className="mb-24">
                <Link to="/products" className="flex items-center justify-center gap-1 text-blue-600 text-sm border border-blue-300 px-4 py-2.5 rounded-xl hover:bg-blue-50 w-full">
                  ← Back to shop
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── MOBILE FIXED CHECKOUT BAR ── */}
      {cart.length > 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">{totalItems} items</span>
            <span className="font-bold text-gray-800">${total.toFixed(2)}</span>
          </div>
          <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold text-sm transition">
            Proceed to Checkout
          </button>
        </div>
      )}

      {/* ── MOBILE BOTTOM NAV (only when cart is empty) ── */}
      {cart.length === 0 && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-lg">
          <div className="flex items-center justify-around px-2 py-2">
            <Link to="/" className="flex flex-col items-center text-gray-400 hover:text-blue-600 py-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
              </svg>
              <span className="text-xs mt-0.5">Home</span>
            </Link>
            <Link to="/products" className="flex flex-col items-center text-gray-400 hover:text-blue-600 py-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
              </svg>
              <span className="text-xs mt-0.5">Browse</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center text-blue-600 py-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span className="text-xs mt-0.5">Cart</span>
            </Link>
            <Link to="/login" className="flex flex-col items-center text-gray-400 hover:text-blue-600 py-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span className="text-xs mt-0.5">Profile</span>
            </Link>
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer className="bg-white py-8 md:py-10 px-4 md:px-6 border-t border-gray-200 mt-6 md:mt-10">
        {/* Desktop footer */}
        <div className="hidden md:flex max-w-7xl mx-auto gap-10">
          <div className="w-56 shrink-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-blue-600 text-white p-2 rounded text-sm font-bold">B</div>
              <span className="font-bold text-blue-600 text-xl">Brand</span>
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">Best information about the company goes here but now lorem ipsum is</p>
            <div className="flex gap-2">
              {[
                { bg: 'bg-blue-600', label: 'f' },
                { bg: 'bg-sky-400', label: '𝕏' },
                { bg: 'bg-blue-700', label: 'in' },
                { bg: 'bg-pink-500', label: '📷' },
                { bg: 'bg-gray-500', label: '✉' },
              ].map((s, i) => (
                <div key={i} className={`w-8 h-8 rounded-full ${s.bg} text-white flex items-center justify-center text-xs cursor-pointer hover:opacity-80`}>
                  {s.label}
                </div>
              ))}
            </div>
          </div>
          {[
            { title: 'About', links: ['About Us', 'Find store', 'Categories', 'Blogs'] },
            { title: 'Partnership', links: ['About Us', 'Find store', 'Categories', 'Blogs'] },
            { title: 'Information', links: ['Help Center', 'Money Refund', 'Shipping', 'Contact us'] },
            { title: 'For users', links: ['Login', 'Register', 'Settings', 'My Orders'] },
          ].map(col => (
            <div key={col.title} className="flex-1">
              <h4 className="font-bold mb-4 text-sm text-gray-800">{col.title}</h4>
              {col.links.map(link => (
                <p key={link} className="text-xs text-gray-500 mb-2.5 hover:text-blue-600 cursor-pointer">{link}</p>
              ))}
            </div>
          ))}
          <div className="w-40 shrink-0">
            <h4 className="font-bold mb-4 text-sm text-gray-800">Get app</h4>
            <div className="bg-black text-white rounded-xl px-3 py-2 mb-2 cursor-pointer hover:bg-gray-800 flex items-center gap-2">
              <span className="text-xl">🍎</span>
              <div><p className="text-xs text-gray-400">Download on the</p><p className="text-sm font-bold">App Store</p></div>
            </div>
            <div className="bg-black text-white rounded-xl px-3 py-2 cursor-pointer hover:bg-gray-800 flex items-center gap-2">
              <span className="text-xl">▶</span>
              <div><p className="text-xs text-gray-400">GET IT ON</p><p className="text-sm font-bold">Google Play</p></div>
            </div>
          </div>
        </div>

        {/* Mobile footer */}
        <div className="md:hidden max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-blue-600 text-white p-2 rounded text-sm font-bold">B</div>
            <span className="font-bold text-blue-600 text-lg">Brand</span>
          </div>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">Best information about the company goes here</p>
          <div className="flex gap-2 mb-5">
            {[
              { bg: 'bg-blue-600', label: 'f' },
              { bg: 'bg-sky-400', label: '𝕏' },
              { bg: 'bg-blue-700', label: 'in' },
              { bg: 'bg-pink-500', label: '📷' },
              { bg: 'bg-gray-500', label: '✉' },
            ].map((s, i) => (
              <div key={i} className={`w-8 h-8 rounded-full ${s.bg} text-white flex items-center justify-center text-xs`}>{s.label}</div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            {[
              { title: 'About', links: ['About Us', 'Find store', 'Categories', 'Blogs'] },
              { title: 'Information', links: ['Help Center', 'Money Refund', 'Shipping', 'Contact us'] },
              { title: 'Partnership', links: ['About Us', 'Find store', 'Categories', 'Blogs'] },
              { title: 'For users', links: ['Login', 'Register', 'Settings', 'My Orders'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-bold mb-2 text-xs text-gray-800">{col.title}</h4>
                {col.links.map(link => (
                  <p key={link} className="text-xs text-gray-500 mb-1.5 hover:text-blue-600 cursor-pointer">{link}</p>
                ))}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="flex-1 bg-black text-white rounded-xl px-3 py-2 cursor-pointer hover:bg-gray-800 flex items-center gap-2">
              <span className="text-lg">🍎</span>
              <div><p className="text-xs text-gray-400">Download on the</p><p className="text-xs font-bold">App Store</p></div>
            </div>
            <div className="flex-1 bg-black text-white rounded-xl px-3 py-2 cursor-pointer hover:bg-gray-800 flex items-center gap-2">
              <span className="text-lg">▶</span>
              <div><p className="text-xs text-gray-400">GET IT ON</p><p className="text-xs font-bold">Google Play</p></div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-6 md:mt-8 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400">
          <span>© 2026 Ecommerce.</span>
          <span>🇺🇸 English ▾</span>
        </div>
      </footer>
    </div>
  )
}

export default Cart