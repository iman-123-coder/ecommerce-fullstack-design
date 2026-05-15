import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [time, setTime] = useState({ days: 4, hours: 13, mins: 34, secs: 56 })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => { setProducts(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(prev => {
        let { days, hours, mins, secs } = prev
        secs--
        if (secs < 0) { secs = 59; mins-- }
        if (mins < 0) { mins = 59; hours-- }
        if (hours < 0) { hours = 23; days-- }
        return { days, hours, mins, secs }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const featured = products.filter(p => p.featured)
  const recommended = products.filter(p => !p.featured)

  const categories = [
    'Automobiles', 'Clothes and wear', 'Home interiors',
    'Computer and tech', 'Tools, equipments', 'Sports and outdoor',
    'Animal and pets', 'Machinery tools', 'More category'
  ]

  const services = [
    {
      title: 'Source from Industry Hubs',
      img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=600',
      icon: '🔍'
    },
    {
      title: 'Customize Your Products',
      img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600',
      icon: '📋'
    },
    {
      title: 'Fast, reliable shipping by ocean or air',
      img: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=600',
      icon: '✈️'
    },
    {
      title: 'Product monitoring and inspection',
      img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600',
      icon: '🛡️'
    },
  ]

  const suppliers = [
    { country: 'Arabic Emirates', domain: 'shopname.ae',     flag: 'https://flagcdn.com/w40/ae.png' },
    { country: 'Australia',       domain: 'shopname.ae',     flag: 'https://flagcdn.com/w40/au.png' },
    { country: 'United States',   domain: 'shopname.ae',     flag: 'https://flagcdn.com/w40/us.png' },
    { country: 'Russia',          domain: 'shopname.ru',     flag: 'https://flagcdn.com/w40/ru.png' },
    { country: 'Italy',           domain: 'shopname.it',     flag: 'https://flagcdn.com/w40/it.png' },
    { country: 'Denmark',         domain: 'denmark.com.dk',  flag: 'https://flagcdn.com/w40/dk.png' },
    { country: 'France',          domain: 'shopname.com.fr', flag: 'https://flagcdn.com/w40/fr.png' },
    { country: 'Arabic Emirates', domain: 'shopname.ae',     flag: 'https://flagcdn.com/w40/ae.png' },
    { country: 'China',           domain: 'shopname.ae',     flag: 'https://flagcdn.com/w40/cn.png' },
    { country: 'Great Britain',   domain: 'shopname.co.uk',  flag: 'https://flagcdn.com/w40/gb.png' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ══════════════════════════════════════
          TOP NAVBAR — Desktop (hidden on mobile)
      ══════════════════════════════════════ */}
      <nav className="bg-white border-b py-3 px-6 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="bg-blue-600 text-white p-2 rounded text-sm">🛒</div>
            <span className="font-bold text-blue-600 text-xl">Brand</span>
          </Link>

          <div className="flex flex-1 border border-gray-300 rounded overflow-hidden">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 px-4 py-2 outline-none text-sm"
            />
            <select className="border-l px-3 py-2 text-sm text-gray-600 outline-none bg-gray-50">
              <option>All category</option>
              <option>Electronics</option>
              <option>Clothes and wear</option>
              <option>Home and outdoor</option>
            </select>
            <Link
              to={`/products?search=${search}`}
              className="bg-blue-600 text-white px-6 py-2 text-sm hover:bg-blue-700 flex items-center font-medium"
            >
              Search
            </Link>
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
            <Link to="/cart" className="flex flex-col items-center gap-0.5 hover:text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span className="text-xs">My cart</span>
            </Link>
          </div>
        </div>

        {/* Second nav row */}
        <div className="max-w-7xl mx-auto flex items-center gap-6 mt-2 pt-2 border-t border-gray-100 text-sm text-gray-700">
          <button className="flex items-center gap-1.5 font-semibold hover:text-blue-600">
            ☰ All category
          </button>
          <Link to="#" className="hover:text-blue-600">Hot offers</Link>
          <Link to="#" className="hover:text-blue-600">Gift boxes</Link>
          <Link to="#" className="hover:text-blue-600">Projects</Link>
          <Link to="#" className="hover:text-blue-600">Menu item</Link>
          <span className="cursor-pointer hover:text-blue-600">Help ▾</span>
          <div className="ml-auto flex items-center gap-5 text-gray-500 text-xs">
            <span className="cursor-pointer hover:text-blue-600">English, USD ▾</span>
            <span className="cursor-pointer hover:text-blue-600">Ship to 🇩🇪 ▾</span>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          MOBILE NAVBAR
      ══════════════════════════════════════ */}
      <nav className="bg-white border-b md:hidden sticky top-0 z-50">
        {/* Mobile top bar */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          {/* Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5 mr-auto">
            <div className="bg-blue-600 text-white p-1.5 rounded text-xs">🛒</div>
            <span className="font-bold text-blue-600 text-lg">Brand</span>
          </Link>

          {/* Search icon */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="text-gray-600 p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>

          {/* Cart icon */}
          <Link to="/cart" className="text-gray-600 p-1 relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </Link>

          {/* Profile icon */}
          <Link to="/login" className="text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </Link>
        </div>

        {/* Mobile search bar (collapsible) */}
        {mobileSearchOpen && (
          <div className="flex border-t border-gray-100 px-3 py-2 gap-2">
            <div className="flex flex-1 border border-gray-300 rounded overflow-hidden">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 px-3 py-2 outline-none text-sm"
                autoFocus
              />
              <Link
                to={`/products?search=${search}`}
                className="bg-blue-600 text-white px-4 py-2 text-sm"
              >
                Go
              </Link>
            </div>
          </div>
        )}

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white pb-2">
            <div className="px-4 py-3 border-b border-gray-50">
              <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Categories</p>
              {categories.map(cat => (
                <Link
                  to={`/products?category=${cat}`}
                  key={cat}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm text-gray-700 hover:text-blue-600 border-b border-gray-50 last:border-0"
                >
                  {cat}
                </Link>
              ))}
            </div>
            <div className="px-4 pt-3 flex flex-col gap-2">
              <Link to="/signup" className="block bg-blue-600 text-white text-center py-2 rounded text-sm font-medium">
                Join now
              </Link>
              <Link to="/login" className="block border border-blue-300 text-blue-600 text-center py-2 rounded text-sm">
                Log in
              </Link>
            </div>
            <div className="px-4 pt-3 flex gap-4 text-sm text-gray-500 border-t border-gray-100 mt-2">
              <span>🇺🇸 English</span>
              <span>USD</span>
              <span>Ship to 🇩🇪</span>
            </div>
          </div>
        )}

        {/* Mobile category chips scroll */}
        {!mobileMenuOpen && !mobileSearchOpen && (
          <div className="flex gap-2 px-3 py-2 overflow-x-auto border-t border-gray-100 scrollbar-hide">
            {categories.map(cat => (
              <Link
                to={`/products?category=${cat}`}
                key={cat}
                className="shrink-0 text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1 hover:bg-blue-50 hover:text-blue-600 whitespace-nowrap"
              >
                {cat}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════
          HERO SECTION — Desktop
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-4 gap-3 hidden md:flex">
        {/* Category sidebar */}
        <div className="w-48 shrink-0 bg-white rounded shadow-sm py-2">
          {categories.map((cat, i) => (
            <Link
              to={`/products?category=${cat}`}
              key={cat}
              className={`flex items-center py-2 px-4 text-sm hover:bg-blue-50 hover:text-blue-600 transition
                ${i === 0 ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 font-medium' : 'text-gray-700'}`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {/* Hero banner */}
        <div className="flex-1 rounded-xl relative overflow-hidden min-h-[250px]" style={{ background: '#3bb5a6' }}>
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900"
            alt="Hero electronics"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/75 via-teal-400/50 to-transparent" />
          <div className="relative z-10 p-8 h-full flex flex-col justify-center">
            <p className="text-white/90 text-base mb-1">Latest trending</p>
            <h1 className="text-white text-4xl font-bold mb-6 drop-shadow">Electronic items</h1>
            <button className="bg-white text-gray-800 px-6 py-2 rounded text-sm hover:bg-gray-50 w-fit font-medium shadow">
              Learn more
            </button>
          </div>
        </div>

        {/* Right auth panel */}
        <div className="w-48 shrink-0 flex flex-col gap-2">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 text-base">👤</div>
              <div>
                <p className="text-xs text-gray-400 leading-none">Hi, user</p>
                <p className="text-xs font-semibold text-gray-700 leading-tight">let's get started</p>
              </div>
            </div>
            <Link to="/signup" className="block bg-blue-600 text-white text-center py-1.5 rounded mb-2 text-sm hover:bg-blue-700 font-medium">
              Join now
            </Link>
            <Link to="/login" className="block border border-blue-300 text-blue-600 text-center py-1.5 rounded text-sm hover:bg-blue-50">
              Log in
            </Link>
          </div>
          <div className="bg-orange-400 text-white rounded-lg p-3 text-xs font-medium leading-snug cursor-pointer hover:bg-orange-500">
            Get US $10 off with a new supplier
          </div>
          <div className="bg-blue-500 text-white rounded-lg p-3 text-xs font-medium leading-snug cursor-pointer hover:bg-blue-600">
            Send quotes with supplier preferences
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          HERO SECTION — Mobile
      ══════════════════════════════════════ */}
      <div className="md:hidden px-3 py-3">
        {/* Mobile hero banner */}
        <div className="rounded-xl relative overflow-hidden h-44" style={{ background: '#3bb5a6' }}>
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900"
            alt="Hero electronics"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/80 via-teal-400/60 to-transparent" />
          <div className="relative z-10 p-5 h-full flex flex-col justify-center">
            <p className="text-white/90 text-xs mb-1">Latest trending</p>
            <h1 className="text-white text-2xl font-bold mb-4 drop-shadow">Electronic items</h1>
            <button className="bg-white text-gray-800 px-4 py-1.5 rounded text-xs hover:bg-gray-50 w-fit font-medium shadow">
              Learn more
            </button>
          </div>
        </div>

        {/* Mobile auth + promo pills */}
        <div className="flex gap-2 mt-3">
          <Link to="/signup" className="flex-1 bg-blue-600 text-white text-center py-2 rounded text-sm font-medium">
            Join now
          </Link>
          <Link to="/login" className="flex-1 border border-blue-300 text-blue-600 text-center py-2 rounded text-sm">
            Log in
          </Link>
        </div>
        <div className="flex gap-2 mt-2">
          <div className="flex-1 bg-orange-400 text-white rounded-lg p-2.5 text-xs font-medium leading-snug">
            Get US $10 off with a new supplier
          </div>
          <div className="flex-1 bg-blue-500 text-white rounded-lg p-2.5 text-xs font-medium leading-snug">
            Send quotes with supplier preferences
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          DEALS AND OFFERS
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-3">
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-5">
          {/* Header row */}
          <div className="flex items-center justify-between mb-3 md:mb-0">
            <div className="md:hidden">
              <h2 className="font-bold text-base">Deals and offers</h2>
              <p className="text-gray-400 text-xs">Hygiene equipments</p>
            </div>
            {/* Countdown — mobile: inline right, desktop: left panel */}
            <div className="flex gap-1.5 md:hidden">
              {[
                { val: time.days,  label: 'Days' },
                { val: time.hours, label: 'Hr' },
                { val: time.mins,  label: 'Min' },
                { val: time.secs,  label: 'Sec' },
              ].map(({ val, label }) => (
                <div key={label} className="bg-gray-800 text-white rounded px-1.5 py-1 text-center min-w-[36px]">
                  <div className="font-bold text-xs tabular-nums">{String(val).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400" style={{ fontSize: '9px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            {/* Desktop left panel */}
            <div className="w-44 shrink-0 hidden md:block">
              <h2 className="font-bold text-lg">Deals and offers</h2>
              <p className="text-gray-400 text-sm mt-0.5 mb-5">Hygiene equipments</p>
              <div className="flex gap-1.5">
                {[
                  { val: time.days,  label: 'Days' },
                  { val: time.hours, label: 'Hour' },
                  { val: time.mins,  label: 'Min'  },
                  { val: time.secs,  label: 'Sec'  },
                ].map(({ val, label }) => (
                  <div key={label} className="bg-gray-800 text-white rounded-md px-1 py-1 text-center min-w-[42px]">
                    <div className="font-bold text-sm tabular-nums">{String(val).padStart(2, '0')}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Products: 5-col desktop, 2-col mobile scrollable */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-5 divide-x divide-gray-100 md:divide-y-0 divide-y">
              {featured.slice(0, 5).map(p => (
                <Link
                  to={`/products/${p.id}`}
                  key={p.id}
                  className="flex flex-col items-center px-2 md:px-3 py-3 md:py-4 hover:bg-gray-50 text-center"
                >
                  <img src={p.image} alt={p.name} className="w-full h-20 md:h-28 object-cover rounded" />
                  <p className="text-xs font-medium text-gray-700 leading-tight mt-2 mb-1.5 line-clamp-2">{p.name}</p>
                  <span className="bg-red-100 text-red-500 text-xs px-2 py-0.5 rounded-full font-medium">
                    -{p.discount}%
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          HOME AND OUTDOOR
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-3">
        <div className="bg-white rounded-lg shadow-sm flex flex-col md:flex-row overflow-hidden">
          {/* Section header */}
          <div className="w-full md:w-48 md:shrink-0 bg-amber-50 p-4 md:p-5 flex md:flex-col justify-between items-center md:items-start flex-row">
            <div>
              <h3 className="font-bold text-base md:text-lg leading-snug">Home and outdoor</h3>
              <button className="mt-2 md:mt-4 border border-gray-400 px-4 md:px-5 py-1 md:py-1.5 rounded text-sm hover:bg-white text-gray-700 bg-transparent">
                Source now
              </button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500"
              alt="Home and outdoor"
              className="w-20 h-20 md:w-full md:h-36 object-cover rounded-lg md:mt-4"
            />
          </div>
          {/* Products grid: 2-col mobile, 4-col desktop */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 md:grid-rows-2">
            {products.filter(p => p.category === 'Home and outdoor').slice(0, 8).map(p => (
              <Link
                to={`/products/${p.id}`}
                key={p.id}
                className="flex items-center justify-between px-3 py-3 border border-gray-100 hover:bg-gray-50"
              >
                <div className="flex-1 pr-2 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-800 leading-tight line-clamp-2">{p.name}</p>
                  <p className="text-xs text-gray-400 mt-1">From</p>
                  <p className="text-xs font-semibold text-gray-700">USD {p.price}</p>
                </div>
                <img src={p.image} alt={p.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          CONSUMER ELECTRONICS
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-3">
        <div className="bg-white rounded-lg shadow-sm flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-48 md:shrink-0 bg-blue-50 p-4 md:p-5 flex md:flex-col justify-between items-center md:items-start flex-row">
            <div>
              <h3 className="font-bold text-base md:text-lg leading-snug">Consumer electronics and gadgets</h3>
              <button className="mt-2 md:mt-4 border border-gray-400 px-4 md:px-5 py-1 md:py-1.5 rounded text-sm hover:bg-white text-gray-700 bg-transparent">
                Source now
              </button>
            </div>
            <img
              src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500"
              alt="Consumer electronics"
              className="w-20 h-20 md:w-full md:h-36 object-cover rounded-lg md:mt-4"
            />
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 md:grid-rows-2">
            {products.filter(p => p.category === 'Electronics' || p.category === 'Computer & tech').slice(0, 8).map(p => (
              <Link
                to={`/products/${p.id}`}
                key={p.id}
                className="flex items-center justify-between px-3 py-3 border border-gray-100 hover:bg-gray-50"
              >
                <div className="flex-1 pr-2 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-800 leading-tight line-clamp-2">{p.name}</p>
                  <p className="text-xs text-gray-400 mt-1">From</p>
                  <p className="text-xs font-semibold text-gray-700">USD {p.price}</p>
                </div>
                <img src={p.image} alt={p.name} className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          SUPPLIER BANNER
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-3">
        <div className="rounded-xl p-5 md:p-10 flex flex-col md:flex-row gap-5 md:gap-10 items-center relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)' }}>
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900"
            alt="bg"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="flex-1 text-white z-10 text-center md:text-left">
            <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 leading-tight">
              An easy way to send<br />requests to all suppliers
            </h2>
            <p className="text-blue-100 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit,
              sed do eiusmod tempor incididunt.
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 md:p-6 w-full md:w-80 shrink-0 z-10 shadow-xl">
            <h3 className="font-bold mb-4 text-gray-800">Send quote to suppliers</h3>
            <input
              placeholder="What item you need?"
              className="w-full border border-gray-200 px-3 py-2.5 rounded-lg text-sm mb-3 outline-none focus:border-blue-400"
            />
            <textarea
              placeholder="Type more details"
              className="w-full border border-gray-200 px-3 py-2.5 rounded-lg text-sm mb-3 outline-none h-20 resize-none focus:border-blue-400"
            />
            <div className="flex gap-2 mb-4">
              <input
                placeholder="Quantity"
                className="flex-1 border border-gray-200 px-3 py-2.5 rounded-lg text-sm outline-none focus:border-blue-400"
              />
              <select className="border border-gray-200 px-3 py-2.5 rounded-lg text-sm outline-none focus:border-blue-400 bg-white">
                <option>Pcs</option>
                <option>Kg</option>
                <option>Box</option>
              </select>
            </div>
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 text-sm font-medium">
              Send inquiry
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RECOMMENDED ITEMS
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4">
        <h2 className="font-bold text-lg md:text-xl mb-4">Recommended items</h2>
        {/* 2-col mobile, 5-col desktop */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-3">
          {recommended.map(p => (
            <Link
              to={`/products/${p.id}`}
              key={p.id}
              className="bg-white rounded-lg border border-gray-100 hover:shadow-md transition flex flex-col overflow-hidden"
            >
              <img src={p.image} alt={p.name} className="w-full h-36 md:h-48 object-cover" />
              <div className="p-2 md:p-3">
                <p className="font-bold text-sm md:text-base text-gray-900">${p.price}</p>
                <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">{p.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          OUR EXTRA SERVICES
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-3">
        <h2 className="font-bold text-lg md:text-xl mb-4">Our extra services</h2>
        {/* 2-col mobile, 4-col desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {services.map(s => (
            <div
              key={s.title}
              className="bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition cursor-pointer"
            >
              <div className="relative">
                <img src={s.img} alt={s.title} className="w-full h-28 md:h-40 object-cover" />
                <div className="absolute bottom-2 right-2 md:bottom-3 md:right-3 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-md text-base md:text-lg">
                  {s.icon}
                </div>
              </div>
              <p className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm font-semibold text-gray-800">{s.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          SUPPLIERS BY REGION
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-3">
        <div className="bg-white rounded-lg border border-gray-100 p-4 md:p-6">
          <h2 className="font-bold text-lg md:text-xl mb-4 md:mb-5">Suppliers by region</h2>
          {/* 2-col mobile, 5-col desktop */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-5">
            {suppliers.map((s, i) => (
              <div key={i} className="flex items-center gap-2 md:gap-3 cursor-pointer hover:text-blue-600 group">
                <img
                  src={s.flag}
                  alt={s.country}
                  className="w-8 h-5 md:w-9 md:h-6 object-cover rounded shadow-sm shrink-0 border border-gray-100"
                />
                <div>
                  <p className="text-xs md:text-sm font-medium text-gray-800 group-hover:text-blue-600 leading-tight">{s.country}</p>
                  <p className="text-xs text-gray-400 hidden md:block">{s.domain}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          NEWSLETTER
      ══════════════════════════════════════ */}
      <div className="bg-gray-50 py-8 md:py-10 mt-4 border-t border-gray-200">
        <div className="max-w-lg mx-auto text-center px-4">
          <h2 className="font-bold text-lg md:text-xl mb-2">Subscribe on our newsletter</h2>
          <p className="text-gray-500 text-sm mb-5">
            Get daily news on upcoming offers from many suppliers all over the world
          </p>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
            <span className="px-3 md:px-4 text-gray-400 flex items-center text-base">✉</span>
            <input placeholder="Email" className="flex-1 py-2.5 outline-none text-sm text-gray-700" />
            <button className="bg-blue-600 text-white px-4 md:px-7 py-2.5 text-sm hover:bg-blue-700 font-medium">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-white py-8 md:py-10 px-4 md:px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          {/* Desktop: flex row | Mobile: grid 2-col */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-10">
            {/* Brand column */}
            <div className="md:w-56 md:shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-600 text-white p-2 rounded text-sm">🛒</div>
                <span className="font-bold text-blue-600 text-xl">Brand</span>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                Best information about the company goes here but now lorem ipsum is
              </p>
              <div className="flex gap-2">
                {[
                  { bg: 'bg-blue-600', label: 'f' },
                  { bg: 'bg-sky-400',  label: '𝕏' },
                  { bg: 'bg-blue-700', label: 'in' },
                  { bg: 'bg-pink-500', label: '📷' },
                  { bg: 'bg-gray-500', label: '✉' },
                ].map((s, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full ${s.bg} text-white flex items-center justify-center text-xs cursor-pointer hover:opacity-80`}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Links columns — 2x2 on mobile, row on desktop */}
            <div className="grid grid-cols-2 md:flex md:flex-1 gap-6 md:gap-0">
              {[
                { title: 'About',       links: ['About Us', 'Find store', 'Categories', 'Blogs'] },
                { title: 'Partnership', links: ['About Us', 'Find store', 'Categories', 'Blogs'] },
                { title: 'Information', links: ['Help Center', 'Money Refund', 'Shipping', 'Contact us'] },
                { title: 'For users',   links: ['Login', 'Register', 'Settings', 'My Orders'] },
              ].map(col => (
                <div key={col.title} className="md:flex-1">
                  <h4 className="font-bold mb-3 text-sm text-gray-800">{col.title}</h4>
                  {col.links.map(link => (
                    <p key={link} className="text-xs text-gray-500 mb-2 hover:text-blue-600 cursor-pointer">
                      {link}
                    </p>
                  ))}
                </div>
              ))}
            </div>

            {/* App download */}
            <div className="md:w-40 md:shrink-0">
              <h4 className="font-bold mb-4 text-sm text-gray-800">Get app</h4>
              <div className="bg-black text-white rounded-xl px-3 py-2 mb-2 cursor-pointer hover:bg-gray-800 flex items-center gap-2">
                <span className="text-xl leading-none">🍎</span>
                <div>
                  <p className="text-xs text-gray-400 leading-none">Download on the</p>
                  <p className="text-sm font-bold leading-tight">App Store</p>
                </div>
              </div>
              <div className="bg-black text-white rounded-xl px-3 py-2 cursor-pointer hover:bg-gray-800 flex items-center gap-2">
                <span className="text-xl leading-none">▶</span>
                <div>
                  <p className="text-xs text-gray-400 leading-none">GET IT ON</p>
                  <p className="text-sm font-bold leading-tight">Google Play</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400">
            <span>© 2026 Ecommerce.</span>
            <span className="cursor-pointer hover:text-blue-600">🇺🇸 English ▾</span>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          MOBILE BOTTOM NAV BAR
      ══════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 flex">
        <Link to="/" className="flex-1 flex flex-col items-center justify-center py-2 text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span className="text-xs mt-0.5 font-medium">Home</span>
        </Link>
        <Link to="/products" className="flex-1 flex flex-col items-center justify-center py-2 text-gray-500 hover:text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
          <span className="text-xs mt-0.5">Browse</span>
        </Link>
        <Link to="/cart" className="flex-1 flex flex-col items-center justify-center py-2 text-gray-500 hover:text-blue-600 relative">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          <span className="text-xs mt-0.5">Cart</span>
        </Link>
        <Link to="/login" className="flex-1 flex flex-col items-center justify-center py-2 text-gray-500 hover:text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
          <span className="text-xs mt-0.5">Profile</span>
        </Link>
      </div>

      {/* Bottom padding so content isn't hidden behind mobile nav */}
      <div className="md:hidden h-16" />
    </div>
  )
}

export default Home