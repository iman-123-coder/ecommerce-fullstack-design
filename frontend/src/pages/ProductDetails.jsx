import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'

const ProductDetails = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [relatedProducts, setRelatedProducts] = useState([])
  const [savedForLater, setSavedForLater] = useState(false)

  // Mobile state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:5000/api/products/${id}`)
      setProduct(res.data)
      fetchRelated(res.data.category)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelated = async (category) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products?category=${category}&limit=6`)
      const all = Array.isArray(res.data) ? res.data : res.data.products || []
      setRelatedProducts(all.filter(p => p.id !== id).slice(0, 6))
    } catch (err) {
      console.error(err)
    }
  }

  const addToCart = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        await axios.post('http://localhost:5000/api/cart',
          { product_id: product.id, quantity },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        alert('Added to cart!')
      } catch (err) {
        console.error(err)
        alert('Failed to add to cart')
      }
    } else {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existing = cart.find(i => i.id === product.id)
      if (existing) {
        existing.quantity += quantity
      } else {
        cart.push({ ...product, quantity })
      }
      localStorage.setItem('cart', JSON.stringify(cart))
      alert('Added to cart!')
    }
  }

  const buyNow = () => {
    addToCart()
    window.location.href = '/cart'
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-blue-600 text-lg font-semibold">Loading...</div>
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-red-500 text-lg">Product not found.</div>
    </div>
  )

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 25

  const stars = product.rating || 4
  const renderStars = (count) => (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i <= count ? 'text-orange-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </span>
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── DESKTOP NAVBAR (hidden on mobile) ── */}
      <nav className="hidden md:block bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-blue-600 text-xl">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm font-bold">B</div>
            Brand
          </Link>
          <div className="flex-1 flex gap-2">
            <input className="flex-1 border border-gray-200 rounded-l px-4 py-2 text-sm focus:outline-none focus:border-blue-400" placeholder="Search..." />
            <select className="border border-l-0 border-gray-200 px-3 py-2 text-sm bg-white focus:outline-none">
              <option>All category</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Kitchen</option>
              <option>Furniture</option>
            </select>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-r text-sm font-medium hover:bg-blue-700">Search</button>
          </div>
          <div className="flex items-center gap-5 text-gray-500 text-sm shrink-0">
            <Link to="/login" className="flex flex-col items-center hover:text-blue-600">
              <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span className="text-xs">Profile</span>
            </Link>
            <Link to="#" className="flex flex-col items-center hover:text-blue-600">
              <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
              <span className="text-xs">Message</span>
            </Link>
            <Link to="#" className="flex flex-col items-center hover:text-blue-600">
              <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
              </svg>
              <span className="text-xs">Orders</span>
            </Link>
            <Link to="/cart" className="flex flex-col items-center hover:text-blue-600 relative">
              <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span className="text-xs">My cart</span>
            </Link>
          </div>
        </div>
        <div className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 text-sm text-gray-600">
            {['All category','Hot offers','Gift boxes','Projects','Menu item','Help'].map(item => (
              <button key={item} className="hover:text-blue-600 whitespace-nowrap">{item}</button>
            ))}
            <div className="ml-auto flex items-center gap-4 text-sm text-gray-500">
              <span>English, USD</span>
              <span>Ship to 🇩🇪</span>
            </div>
          </div>
        </div>
      </nav>

      {/* ── MOBILE NAVBAR (hidden on desktop) ── */}
      <nav className="md:hidden bg-white shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-3 py-2.5">
          {/* Hamburger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1.5 text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 font-bold text-blue-600 text-lg">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">B</div>
            Brand
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="p-1.5 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
            <Link to="/cart" className="p-1.5 text-gray-600 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </Link>
            <Link to="/login" className="p-1.5 text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </Link>
          </div>
        </div>

        {/* Mobile search bar (expandable) */}
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
                <button
                  key={item}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-left py-3 px-2 border-b border-gray-100 text-sm text-gray-700 hover:text-blue-600"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4">

        {/* Breadcrumb */}
        <div className="text-xs md:text-sm text-gray-500 mb-3 md:mb-4 flex items-center gap-1 flex-wrap">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <span>&gt;</span>
          <Link to="/products" className="hover:text-blue-600">Products</Link>
          <span>&gt;</span>
          <span className="text-gray-800 line-clamp-1">{product.name}</span>
        </div>

        {/* ── MAIN PRODUCT CARD ── */}
        <div className="bg-white rounded-xl shadow-sm p-3 md:p-6 mb-4 md:mb-6">

          {/* DESKTOP layout */}
          <div className="hidden md:flex gap-8">
            {/* Left: image + thumbnails */}
            <div className="w-72 shrink-0">
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-3 h-64 bg-white flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                  onError={e => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image' }}
                />
              </div>
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-12 h-12 rounded border-2 overflow-hidden cursor-pointer ${i === 0 ? 'border-blue-500' : 'border-gray-200'}`}>
                    <img src={product.image} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = 'https://via.placeholder.com/50' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Middle: product info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                  In stock
                </span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-2">{product.name}</h1>
              <div className="flex items-center gap-3 mb-3 text-sm text-gray-500">
                {renderStars(stars)}
                <span className="font-medium text-gray-700">{stars}.0 rating</span>
                <span>•</span>
                <span>32 reviews</span>
                <span>•</span>
                <span>154 sold</span>
              </div>
              <div className="flex gap-3 mb-4">
                {[
                  { qty: '50-100 pcs', price: `$${product.price}` },
                  { qty: '100-700 pcs', price: `$${(product.price * 0.92).toFixed(0)}` },
                  { qty: '700+ pcs', price: `$${(product.price * 0.85).toFixed(0)}` },
                ].map((tier, i) => (
                  <div key={i} className={`border rounded px-3 py-2 text-sm ${i === 0 ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}>
                    <div className="font-bold text-gray-800">{tier.price}</div>
                    <div className="text-gray-500 text-xs">{tier.qty}</div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                {[
                  ['Price', 'Negotiable'],
                  ['Type', product.category || 'Classic'],
                  ['Material', 'Plastic material'],
                  ['Design', 'Modern nice'],
                  ['Customization', 'Customized logo and design custom packages'],
                  ['Protection', 'Refund Policy'],
                  ['Warranty', '2 years full warranty'],
                ].map(([label, val]) => (
                  <div key={label} className="flex gap-4">
                    <span className="text-gray-500 w-32 shrink-0">{label}:</span>
                    <span className="text-gray-800 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: supplier box */}
            <div className="w-52 shrink-0">
              <div className="border border-gray-200 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm">S</div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800">Supplier</div>
                    <div className="text-xs text-gray-500">Guanjo Trading LLC</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><span>🇩🇪</span> Germany, Berlin</div>
                <div className="text-xs text-green-600 flex items-center gap-1 mb-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                  Verified Seller
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1 mb-4">🌍 Worldwide shipping</div>
                <button className="w-full border border-blue-600 text-blue-600 py-2 rounded text-sm font-medium hover:bg-blue-50 mb-2">Send inquiry</button>
                <button className="w-full bg-orange-500 text-white py-2 rounded text-sm font-medium hover:bg-orange-600">Seller's profile</button>
              </div>
              <button
                onClick={() => setSavedForLater(!savedForLater)}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-red-500"
              >
                <svg className={`w-4 h-4 ${savedForLater ? 'text-red-500 fill-red-500' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
                Save for later
              </button>
            </div>
          </div>

          {/* ── MOBILE product layout ── */}
          <div className="md:hidden">
            {/* Mobile image carousel */}
            <div className="relative mb-3">
              <div className="rounded-xl overflow-hidden bg-gray-50 h-64 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                  onError={e => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
                />
                {/* Wishlist heart */}
                <button
                  onClick={() => setSavedForLater(!savedForLater)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center"
                >
                  <svg className={`w-4 h-4 ${savedForLater ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                  </svg>
                </button>
                {/* Discount badge */}
                {discount > 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
                    -{discount}%
                  </div>
                )}
              </div>
              {/* Thumbnail strip */}
              <div className="flex gap-2 mt-2 overflow-x-auto pb-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-14 h-14 rounded-lg border-2 overflow-hidden cursor-pointer shrink-0 ${activeImage === i ? 'border-blue-500' : 'border-gray-200'}`}
                  >
                    <img src={product.image} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = 'https://via.placeholder.com/50' }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile product info */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-green-600 text-xs font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                  In stock
                </span>
                <span className="text-xs text-gray-400">154 sold</span>
              </div>

              <h1 className="text-lg font-semibold text-gray-800 mb-2 leading-snug">{product.name}</h1>

              {/* Stars + reviews */}
              <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                {renderStars(stars)}
                <span className="font-medium text-gray-700">{stars}.0</span>
                <span>•</span>
                <span>32 reviews</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                {product.original_price && (
                  <span className="text-sm text-gray-400 line-through">${product.original_price}</span>
                )}
              </div>

              {/* Price tiers — horizontal scroll */}
              <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
                {[
                  { qty: '50-100 pcs', price: `$${product.price}` },
                  { qty: '100-700 pcs', price: `$${(product.price * 0.92).toFixed(0)}` },
                  { qty: '700+ pcs', price: `$${(product.price * 0.85).toFixed(0)}` },
                ].map((tier, i) => (
                  <div key={i} className={`border rounded-lg px-3 py-2 text-xs shrink-0 ${i === 0 ? 'border-orange-400 bg-orange-50' : 'border-gray-200'}`}>
                    <div className="font-bold text-gray-800">{tier.price}</div>
                    <div className="text-gray-500">{tier.qty}</div>
                  </div>
                ))}
              </div>

              {/* Details — compact */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 text-xs mb-4">
                {[
                  ['Price', 'Negotiable'],
                  ['Type', product.category || 'Classic'],
                  ['Material', 'Plastic material'],
                  ['Warranty', '2 years full warranty'],
                ].map(([label, val]) => (
                  <div key={label} className="flex gap-2">
                    <span className="text-gray-500 w-20 shrink-0">{label}:</span>
                    <span className="text-gray-800 font-medium">{val}</span>
                  </div>
                ))}
              </div>

              {/* Quantity + Add to cart (mobile inline) */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 text-gray-600 font-bold text-sm">-</button>
                  <span className="px-3 py-2 text-sm font-medium border-x border-gray-300">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 hover:bg-gray-100 text-gray-600 font-bold text-sm">+</button>
                </div>
                <button onClick={addToCart} className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">
                  Add to cart
                </button>
                <button onClick={buyNow} className="flex-1 border-2 border-blue-600 text-blue-600 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50">
                  Buy now
                </button>
              </div>
            </div>

            {/* Mobile Supplier card */}
            <div className="border border-gray-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">S</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-800">Guanjo Trading LLC</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <span>🇩🇪</span> Germany, Berlin
                    <span className="mx-1">·</span>
                    <span className="text-green-600">✓ Verified</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">🌍 Worldwide</div>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg text-xs font-medium hover:bg-blue-50">Send inquiry</button>
                <button className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-orange-600">Seller's profile</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── TABS + YOU MAY LIKE ── */}
        <div className="flex gap-6 mb-4 md:mb-6">
          {/* Tabs section */}
          <div className="flex-1 bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Tab headers — scrollable on mobile */}
            <div className="flex border-b border-gray-200 overflow-x-auto">
              {['description','reviews','shipping','about seller'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 md:px-6 py-3 text-xs md:text-sm font-medium capitalize transition-colors whitespace-nowrap shrink-0 ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            <div className="p-4 md:p-6">
              {activeTab === 'description' && (
                <div>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-4">
                    {product.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-6">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  </p>
                  {/* Specs table */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                    {[
                      ['Model', '#8786887'],
                      ['Style', 'Classic style'],
                      ['Certificate', 'ISO-898921212'],
                      ['Size', '34mm x 450mm x 19mm'],
                      ['Memory', '36GB RAM'],
                    ].map(([label, val], i) => (
                      <div key={label} className={`flex text-xs md:text-sm ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                        <div className="w-28 md:w-48 px-3 md:px-4 py-2 md:py-3 text-gray-500 font-medium border-r border-gray-200 shrink-0">{label}</div>
                        <div className="px-3 md:px-4 py-2 md:py-3 text-gray-800">{val}</div>
                      </div>
                    ))}
                  </div>
                  {/* Feature checkmarks */}
                  <div className="space-y-2">
                    {['Some great feature name here','Lorem ipsum dolor sit amet, consectetur','Duis aute irure dolor in reprehenderit','Some great feature name here'].map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs md:text-sm text-gray-700">
                        <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                        {feat}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl md:text-5xl font-bold text-gray-800">{stars}.0</div>
                    <div>
                      {renderStars(stars)}
                      <div className="text-xs md:text-sm text-gray-500 mt-1">32 reviews</div>
                    </div>
                  </div>
                  {[5,4,3,2,1].map(s => (
                    <div key={s} className="flex items-center gap-3 mb-2 text-xs md:text-sm">
                      <span className="w-4 text-gray-600">{s}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-400 h-2 rounded-full" style={{width: `${s === stars ? 70 : s === stars - 1 ? 20 : 5}%`}}></div>
                      </div>
                    </div>
                  ))}
                  <div className="mt-6 space-y-4">
                    {['Great product!','Fast delivery, good quality','Exactly as described'].map((review, i) => (
                      <div key={i} className="border-b border-gray-100 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          {renderStars(5)}
                          <span className="text-xs text-gray-400">— User{i+1}</span>
                        </div>
                        <p className="text-xs md:text-sm text-gray-600">{review}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="text-xs md:text-sm text-gray-600 space-y-3">
                  <p className="font-semibold text-gray-800 text-sm md:text-base">Shipping Information</p>
                  <p>We offer worldwide shipping. Orders are processed within 1-2 business days.</p>
                  <div className="grid grid-cols-2 gap-3 md:gap-4 mt-4">
                    {[['Standard Shipping','5-10 business days','Free'],['Express Shipping','2-3 business days','$15'],['Same Day','Order before 12pm','$30'],['International','10-20 business days','$25']].map(([type,time,price]) => (
                      <div key={type} className="border border-gray-200 rounded-lg p-3">
                        <div className="font-medium text-gray-800 mb-1 text-xs md:text-sm">{type}</div>
                        <div className="text-gray-500 text-xs mb-2">{time}</div>
                        <div className="text-blue-600 font-semibold text-xs md:text-sm">{price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'about seller' && (
                <div className="text-xs md:text-sm text-gray-600 space-y-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg md:text-xl shrink-0">G</div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm md:text-base">Guanjo Trading LLC</div>
                      <div className="text-gray-500 text-xs md:text-sm">Berlin, Germany 🇩🇪</div>
                      <div className="text-green-600 text-xs mt-1">✓ Verified Seller · Member since 2018</div>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm">Guanjo Trading LLC is a verified seller with over 5 years of experience in high-quality electronics and accessories with worldwide shipping.</p>
                  <div className="grid grid-cols-3 gap-2 md:gap-4 text-center">
                    {[['1,234','Total Sales'],['4.8','Avg Rating'],['98%','Positive Feedback']].map(([val,label]) => (
                      <div key={label} className="border border-gray-200 rounded-lg p-2 md:p-3">
                        <div className="font-bold text-gray-800 text-base md:text-lg">{val}</div>
                        <div className="text-gray-500 text-xs">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* You may like — hidden on mobile (shown below instead) */}
          <div className="hidden md:block w-56 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">You may like</h3>
              <div className="space-y-3">
                {(relatedProducts.length > 0 ? relatedProducts : [...Array(5)]).slice(0, 5).map((p, i) => (
                  <Link key={p?.id || i} to={p ? `/products/${p.id}` : '#'} className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-1 transition-colors">
                    <img
                      src={p?.image || `https://via.placeholder.com/50?text=P${i+1}`}
                      alt={p?.name || 'Product'}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-100 shrink-0"
                      onError={e => { e.target.src = 'https://via.placeholder.com/50' }}
                    />
                    <div>
                      <div className="text-xs font-medium text-gray-800 line-clamp-2 leading-tight mb-1">{p?.name || 'Product name here'}</div>
                      <div className="text-xs text-gray-500">${p?.price ? (p.price * 0.8).toFixed(0) : '7.00'} – ${p?.price || '99.50'}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── YOU MAY LIKE (mobile only, horizontal scroll) ── */}
        <div className="md:hidden bg-white rounded-xl shadow-sm p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">You may like</h3>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {(relatedProducts.length > 0 ? relatedProducts : [...Array(5)]).slice(0, 5).map((p, i) => (
              <Link key={p?.id || i} to={p ? `/products/${p.id}` : '#'} className="flex flex-col items-center shrink-0 w-24 hover:opacity-80 transition-opacity">
                <img
                  src={p?.image || `https://via.placeholder.com/80?text=P${i+1}`}
                  alt={p?.name || 'Product'}
                  className="w-20 h-20 object-cover rounded-xl border border-gray-100 mb-1.5"
                  onError={e => { e.target.src = 'https://via.placeholder.com/80' }}
                />
                <div className="text-xs font-medium text-gray-800 text-center line-clamp-2 leading-tight mb-0.5">{p?.name || 'Product'}</div>
                <div className="text-xs text-blue-600 font-semibold">${p?.price || '9.99'}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── RELATED PRODUCTS ── */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="font-semibold text-gray-800 text-base md:text-lg mb-4">Related products</h2>
          {/* Desktop: 6 columns | Mobile: 2 columns */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 md:gap-4">
            {(relatedProducts.length > 0 ? relatedProducts : [...Array(6)]).slice(0, 6).map((p, i) => (
              <Link key={p?.id || i} to={p ? `/products/${p.id}` : '#'} className="group">
                <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <img
                    src={p?.image || `https://via.placeholder.com/200?text=Product`}
                    alt={p?.name || 'Product'}
                    className="w-full h-28 md:h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.target.src = 'https://via.placeholder.com/200' }}
                  />
                  <div className="p-2">
                    <div className="text-xs text-gray-500 mb-0.5 line-clamp-1">Xiaomi Redmi 8</div>
                    <div className="text-xs font-semibold text-gray-800 line-clamp-1">{p?.name || 'Product'}</div>
                    <div className="text-xs text-gray-500 mt-1">${p?.price ? (p.price * 0.8).toFixed(0) : '32.00'}-${p?.price || '$40.00'}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ── SUPER DISCOUNT BANNER ── */}
        <div className="bg-blue-600 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 mb-6 md:mb-8">
          <div>
            <h3 className="text-white font-semibold text-base md:text-lg">Super discount on more than 100 USD</h3>
            <p className="text-blue-200 text-xs md:text-sm mt-1">Have you ever finally just write dummy info</p>
          </div>
          <button className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors text-sm w-full md:w-auto">
            Shop now
          </button>
        </div>

        {/* ── FOOTER ── */}
        <footer className="bg-white rounded-xl shadow-sm p-5 md:p-8 mb-6">
          {/* Desktop: 5 cols | Mobile: brand on top + 2×2 grid */}
          <div className="hidden md:grid grid-cols-5 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 font-bold text-blue-600 text-lg mb-3">
                <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">B</div>
                Brand
              </div>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">Best information about the company goes here but now lorem ipsum is</p>
              <div className="flex gap-2">
                {['f','t','in','yt','ig'].map(s => (
                  <div key={s} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500 hover:bg-blue-100 cursor-pointer">{s}</div>
                ))}
              </div>
            </div>
            {[
              {title:'About',links:['About Us','Find store','Categories','Blogs']},
              {title:'Partnership',links:['About Us','Find store','Categories','Blogs']},
              {title:'Information',links:['Help Center','Money Refund','Shipping','Contact us']},
              {title:'For users',links:['Login','Register','Settings','My Orders']},
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-gray-800 mb-3 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-xs text-gray-500 hover:text-blue-600">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Mobile footer */}
          <div className="md:hidden">
            {/* Brand row */}
            <div className="flex items-center gap-2 font-bold text-blue-600 text-lg mb-2">
              <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">B</div>
              Brand
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">Best information about the company goes here</p>
            <div className="flex gap-2 mb-5">
              {['f','t','in','yt','ig'].map(s => (
                <div key={s} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500">{s}</div>
              ))}
            </div>
            {/* 2×2 link grid */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                {title:'About',links:['About Us','Find store','Categories','Blogs']},
                {title:'Information',links:['Help Center','Money Refund','Shipping','Contact us']},
                {title:'Partnership',links:['About Us','Find store','Categories','Blogs']},
                {title:'For users',links:['Login','Register','Settings','My Orders']},
              ].map(col => (
                <div key={col.title}>
                  <h4 className="font-semibold text-gray-800 mb-2 text-xs">{col.title}</h4>
                  <ul className="space-y-1.5">
                    {col.links.map(link => (
                      <li key={link}><a href="#" className="text-xs text-gray-500 hover:text-blue-600">{link}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 pt-4 text-center text-xs text-gray-400">
            © 2025 Ecommerce. All rights reserved.
          </div>
        </footer>
      </div>

      {/* ── FIXED BOTTOM BAR (desktop) ── */}
      <div className="hidden md:flex fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 items-center justify-between z-50 shadow-lg">
        <div className="flex items-center gap-4">
          <span className="text-2xl font-bold text-blue-600">${product.price}</span>
          {discount > 0 && (
            <span className="text-sm bg-red-100 text-red-600 px-2 py-0.5 rounded font-medium">-{discount}% off</span>
          )}
          <span className="text-sm text-gray-500">{product.stock || 20} available</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-gray-100 text-gray-600 font-bold">-</button>
            <span className="px-4 py-2 text-sm font-medium border-x border-gray-300">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 hover:bg-gray-100 text-gray-600 font-bold">+</button>
          </div>
          <button onClick={addToCart} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">Add to cart</button>
          <button onClick={buyNow} className="border-2 border-blue-600 text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">Buy now</button>
        </div>
      </div>

      {/* ── FIXED BOTTOM NAV (mobile only) ── */}
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

      {/* Spacer for fixed bars */}
      <div className="h-20 md:h-20"></div>
    </div>
  )
}

export default ProductDetails