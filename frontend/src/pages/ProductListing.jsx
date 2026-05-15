import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const ProductListing = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [category, setCategory] = useState('All')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [condition, setCondition] = useState('Any')
  const [rating, setRating] = useState(0)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('Featured')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'grid'
  const [brands, setBrands] = useState([])
  const [features, setFeatures] = useState([])
  const [searchParams] = useSearchParams()

  // Mobile-specific state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const categories = [
    'All',
    'Mobile accessory',
    'Electronics',
    'Smartphones',
    'Modern tech',
  ]

  const brandOptions = ['Samsung', 'Apple', 'Huawei', 'Pocco', 'Lenovo']
  const featureOptions = ['Metalic', 'Plastic cover', '8GB Ram', 'Super power', 'Large Memory']
  const conditionOptions = ['Any', 'Refurbished', 'Brand new', 'Old items']

  useEffect(() => {
    const q = searchParams.get('search') || ''
    const cat = searchParams.get('category') || 'All'
    setSearch(q)
    setSearchInput(q)
    setCategory(cat)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [search, category])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let url = 'http://localhost:5000/api/products?'
      if (search) url += `search=${search}&`
      if (category && category !== 'All') url += `category=${encodeURIComponent(category)}`
      const res = await axios.get(url)
      setProducts(res.data)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setSearch(searchInput)
    setMobileSearchOpen(false)
  }

  const toggleBrand = (b) => {
    setBrands(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b])
  }

  const toggleFeature = (f) => {
    setFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  const clearAllFilters = () => {
    setPriceMin('')
    setPriceMax('')
    setCondition('Any')
    setRating(0)
    setVerifiedOnly(false)
    setBrands([])
    setFeatures([])
    setCategory('All')
    setSearch('')
    setSearchInput('')
  }

  // Apply client-side filters
  let filtered = [...products]
  if (priceMin !== '') filtered = filtered.filter(p => p.price >= Number(priceMin))
  if (priceMax !== '') filtered = filtered.filter(p => p.price <= Number(priceMax))
  if (condition !== 'Any') filtered = filtered.filter(p => p.condition === condition)
  if (rating > 0) filtered = filtered.filter(p => (p.rating || 4) >= rating)
  if (brands.length > 0) {
    filtered = filtered.filter(p => brands.some(b => p.brand === b))
  }
  if (features.length > 0) {
    filtered = filtered.filter(p => features.some(f => p.features && p.features.includes(f)))
  }

  // Sort
  if (sortBy === 'Price: Low to High') filtered.sort((a, b) => a.price - b.price)
  if (sortBy === 'Price: High to Low') filtered.sort((a, b) => b.price - a.price)
  if (sortBy === 'Featured') filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))

  const breadcrumb = category !== 'All'
    ? ['Home', 'Clothings', category]
    : ['Home', 'All Products']

  // Sidebar filter panel — shared between desktop sidebar and mobile drawer
  const FilterPanel = () => (
    <div className="flex flex-col gap-3">

      {/* Category */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm text-gray-800">Category</h3>
          <span className="text-gray-400 text-xs cursor-pointer">▲</span>
        </div>
        {categories.map(cat => (
          <div
            key={cat}
            onClick={() => { setCategory(cat); setMobileFiltersOpen(false) }}
            className={`py-1.5 px-2 cursor-pointer text-sm rounded mb-0.5 transition
              ${category === cat
                ? 'text-blue-600 font-semibold'
                : 'hover:text-blue-600 text-gray-600'}`}
          >
            {cat}
            {cat === 'All' && <span className="ml-1 text-xs text-gray-400">›</span>}
          </div>
        ))}
        <button className="text-blue-600 text-xs mt-1 hover:underline">See all</button>
      </div>

      {/* Brands */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm text-gray-800">Brands</h3>
          <span className="text-gray-400 text-xs cursor-pointer">▲</span>
        </div>
        {brandOptions.map(b => (
          <div key={b} className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => toggleBrand(b)}>
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs
              ${brands.includes(b) ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
              {brands.includes(b) && '✓'}
            </div>
            <span className="text-sm text-gray-600">{b}</span>
          </div>
        ))}
        <button className="text-blue-600 text-xs mt-1 hover:underline">See all</button>
      </div>

      {/* Features */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm text-gray-800">Features</h3>
          <span className="text-gray-400 text-xs cursor-pointer">▲</span>
        </div>
        {featureOptions.map(f => (
          <div key={f} className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => toggleFeature(f)}>
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs
              ${features.includes(f) ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
              {features.includes(f) && '✓'}
            </div>
            <span className="text-sm text-gray-600">{f}</span>
          </div>
        ))}
        <button className="text-blue-600 text-xs mt-1 hover:underline">See all</button>
      </div>

      {/* Price range */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm text-gray-800">Price range</h3>
          <span className="text-gray-400 text-xs cursor-pointer">▲</span>
        </div>
        <div className="flex gap-2 mb-3">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={e => setPriceMin(e.target.value)}
            className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-400 w-0"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={e => setPriceMax(e.target.value)}
            className="flex-1 border border-gray-200 rounded px-2 py-1.5 text-sm outline-none focus:border-blue-400 w-0"
          />
        </div>
        <button
          onClick={() => { setPriceMin(''); setPriceMax('') }}
          className="w-full border border-gray-300 text-gray-600 rounded py-1.5 text-sm hover:bg-gray-50"
        >
          Apply
        </button>
      </div>

      {/* Condition */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm text-gray-800">Condition</h3>
          <span className="text-gray-400 text-xs cursor-pointer">▲</span>
        </div>
        {conditionOptions.map(c => (
          <div key={c} className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => setCondition(c)}>
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
              ${condition === c ? 'border-blue-600' : 'border-gray-300'}`}>
              {condition === c && <div className="w-2 h-2 rounded-full bg-blue-600" />}
            </div>
            <span className="text-sm text-gray-600">{c}</span>
          </div>
        ))}
      </div>

      {/* Ratings */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-bold text-sm text-gray-800">Ratings</h3>
          <span className="text-gray-400 text-xs cursor-pointer">▲</span>
        </div>
        {[5, 4, 3, 2].map(r => (
          <div key={r} className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => setRating(r === rating ? 0 : r)}>
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs
              ${rating === r ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300'}`}>
              {rating === r && '✓'}
            </div>
            <span className="text-yellow-400 text-sm">{'★'.repeat(r)}{'☆'.repeat(5 - r)}</span>
          </div>
        ))}
      </div>

    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ══════════════════════════════════════
          DESKTOP NAVBAR — hidden on mobile
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
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 outline-none text-sm"
            />
            <select className="border-l px-3 py-2 text-sm text-gray-600 outline-none bg-gray-50">
              <option>All category</option>
              <option>Electronics</option>
              <option>Clothes & wear</option>
              <option>Home and outdoor</option>
            </select>
            <button
              onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-2 text-sm hover:bg-blue-700 font-medium"
            >
              Search
            </button>
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
          <button className="flex items-center gap-1.5 font-semibold hover:text-blue-600">☰ All category</button>
          <Link to="#" className="hover:text-blue-600">Hot offers</Link>
          <Link to="#" className="hover:text-blue-600">Gift boxes</Link>
          <Link to="#" className="hover:text-blue-600">Projects</Link>
          <Link to="#" className="hover:text-blue-600">Menu item</Link>
          <span className="cursor-pointer hover:text-blue-600">Help ▾</span>
          <div className="ml-auto flex items-center gap-5 text-gray-500 text-xs">
            <span>English, USD ▾</span>
            <span>Ship to 🇩🇪 ▾</span>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          MOBILE NAVBAR
      ══════════════════════════════════════ */}
      <nav className="bg-white border-b md:hidden sticky top-0 z-50">
        {/* Mobile top bar */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-600 p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          <Link to="/" className="flex items-center gap-1.5 mr-auto">
            <div className="bg-blue-600 text-white p-1.5 rounded text-xs">🛒</div>
            <span className="font-bold text-blue-600 text-lg">Brand</span>
          </Link>

          <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>

          <Link to="/cart" className="text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </Link>

          <Link to="/login" className="text-gray-600 p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </Link>
        </div>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="flex border-t border-gray-100 px-3 py-2 gap-2">
            <div className="flex flex-1 border border-gray-300 rounded overflow-hidden">
              <input
                type="text"
                placeholder="Search products..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-3 py-2 outline-none text-sm"
                autoFocus
              />
              <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 text-sm">
                Go
              </button>
            </div>
          </div>
        )}

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white pb-2">
            <div className="px-4 py-3">
              <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Categories</p>
              {categories.map(cat => (
                <div
                  key={cat}
                  onClick={() => { setCategory(cat); setMobileMenuOpen(false) }}
                  className={`py-2 text-sm border-b border-gray-50 last:border-0 cursor-pointer
                    ${category === cat ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                >
                  {cat}
                </div>
              ))}
            </div>
            <div className="px-4 pt-2 flex gap-2">
              <Link to="/signup" className="flex-1 bg-blue-600 text-white text-center py-2 rounded text-sm font-medium">
                Join now
              </Link>
              <Link to="/login" className="flex-1 border border-blue-300 text-blue-600 text-center py-2 rounded text-sm">
                Log in
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════
          MOBILE FILTER DRAWER (full-screen overlay)
      ══════════════════════════════════════ */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          {/* Drawer panel */}
          <div className="absolute right-0 top-0 bottom-0 w-4/5 bg-gray-100 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-10">
              <h2 className="font-bold text-gray-800">Filters</h2>
              <div className="flex items-center gap-3">
                <button onClick={clearAllFilters} className="text-blue-600 text-sm">
                  Clear all
                </button>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-500 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-3">
              <FilterPanel />
            </div>
            <div className="sticky bottom-0 bg-white border-t px-4 py-3">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm"
              >
                Show {filtered.length} results
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
          {breadcrumb.map((b, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span>›</span>}
              {i < breadcrumb.length - 1
                ? <Link to={i === 0 ? '/' : '/products'} className="hover:text-blue-600">{b}</Link>
                : <span className="text-gray-800 font-medium">{b}</span>
              }
            </span>
          ))}
        </div>

        {/* ══ MOBILE: Filter + Sort bar ══ */}
        <div className="flex items-center gap-2 mb-3 md:hidden">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm text-gray-700 font-medium flex-1 justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"/>
            </svg>
            Filters
            {(brands.length + features.length + (condition !== 'Any' ? 1 : 0) + (rating > 0 ? 1 : 0) + (priceMin || priceMax ? 1 : 0)) > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {brands.length + features.length + (condition !== 'Any' ? 1 : 0) + (rating > 0 ? 1 : 0) + (priceMin || priceMax ? 1 : 0)}
              </span>
            )}
          </button>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="flex-1 border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm outline-none text-gray-700"
          >
            <option>Featured</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
          {/* Mobile view toggle */}
          <div className="flex border border-gray-300 bg-white rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
            >
              ☰
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2.5 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}
            >
              ⊞
            </button>
          </div>
        </div>

        {/* ══ MOBILE: Active filter chips ══ */}
        {(category !== 'All' || brands.length > 0 || features.length > 0) && (
          <div className="flex gap-2 mb-3 overflow-x-auto md:hidden pb-1">
            {category !== 'All' && (
              <span className="shrink-0 flex items-center gap-1 bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-full border border-blue-200">
                {category}
                <button onClick={() => setCategory('All')} className="ml-1 text-blue-400 hover:text-blue-700">×</button>
              </span>
            )}
            {brands.map(b => (
              <span key={b} className="shrink-0 flex items-center gap-1 bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-full border border-blue-200">
                {b}
                <button onClick={() => toggleBrand(b)} className="ml-1 text-blue-400 hover:text-blue-700">×</button>
              </span>
            ))}
            {features.map(f => (
              <span key={f} className="shrink-0 flex items-center gap-1 bg-blue-50 text-blue-600 text-xs px-3 py-1.5 rounded-full border border-blue-200">
                {f}
                <button onClick={() => toggleFeature(f)} className="ml-1 text-blue-400 hover:text-blue-700">×</button>
              </span>
            ))}
            <button onClick={clearAllFilters} className="shrink-0 text-xs text-gray-500 hover:text-red-500 px-2">
              Clear all
            </button>
          </div>
        )}

        <div className="flex gap-4">

          {/* ══════════════════════════════════════
              DESKTOP SIDEBAR — hidden on mobile
          ══════════════════════════════════════ */}
          <div className="w-56 shrink-0 hidden md:block">
            <FilterPanel />
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">

            {/* Desktop top bar */}
            <div className="hidden md:flex items-center justify-between mb-3 bg-white rounded-lg shadow-sm px-4 py-2.5">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-semibold text-gray-800">{filtered.length} items</span>
                <span className="text-gray-400">in {category !== 'All' ? category : 'all categories'}</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-500 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={e => setVerifiedOnly(e.target.checked)}
                    className="rounded"
                  />
                  Verified only
                </label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="border border-gray-200 rounded px-3 py-1.5 text-sm outline-none focus:border-blue-400 bg-white"
                >
                  <option>Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Newest</option>
                </select>
                <div className="flex border border-gray-200 rounded overflow-hidden">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-2.5 py-1.5 text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    ☰
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-2.5 py-1.5 text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    ⊞
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile result count */}
            <div className="md:hidden text-sm text-gray-500 mb-2">
              <span className="font-semibold text-gray-800">{filtered.length} items</span>
              {' '}in {category !== 'All' ? category : 'all categories'}
            </div>

            {loading ? (
              <div className="bg-white rounded-lg p-12 text-center text-gray-400">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="bg-white rounded-lg p-12 text-center">
                <p className="text-gray-500 text-lg mb-2">No products found</p>
                <button onClick={clearAllFilters} className="text-blue-600 text-sm hover:underline">Clear all filters</button>
              </div>
            ) : viewMode === 'list' ? (
              /* LIST VIEW */
              <div className="flex flex-col gap-2 md:gap-3">
                {filtered.map(product => (
                  <Link
                    to={`/products/${product.id}`}
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm p-3 md:p-4 flex gap-3 md:gap-4 hover:shadow-md transition group"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 md:w-44 md:h-36 shrink-0 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-gray-800 text-sm md:text-base leading-snug line-clamp-2">{product.name}</h3>
                        <button className="text-gray-300 hover:text-red-400 shrink-0 text-lg hidden md:block">♡</button>
                      </div>
                      <div className="flex items-center gap-2 mt-1 mb-1 md:mb-2">
                        <span className="text-base md:text-xl font-bold text-gray-900">${product.price}</span>
                        {product.discount > 0 && (
                          <>
                            <span className="text-xs md:text-sm text-gray-400 line-through">
                              ${Math.round(product.price / (1 - product.discount / 100))}
                            </span>
                            <span className="bg-red-100 text-red-500 text-xs px-1.5 md:px-2 py-0.5 rounded-full font-medium">
                              -{product.discount}%
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mb-1 md:mb-2">
                        <span className="text-yellow-400 text-xs md:text-sm">★★★★</span>
                        <span className="text-gray-300 text-xs md:text-sm">★</span>
                        <span className="text-xs text-gray-500 ml-1 hidden md:inline">7.5 · 154 orders · </span>
                        <span className="text-xs text-green-600 font-medium">Free Shipping</span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-500 leading-relaxed line-clamp-2 hidden md:block">
                        {product.description || 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'}
                      </p>
                      <span className="text-blue-600 text-xs md:text-sm mt-1 md:mt-2 inline-block">
                        View details
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* GRID VIEW — 2-col mobile, 3-col desktop */
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                {filtered.map(product => (
                  <Link
                    to={`/products/${product.id}`}
                    key={product.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition group"
                  >
                    <div className="w-full h-32 md:h-44 overflow-hidden bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="p-2 md:p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-yellow-400 text-xs">★★★★☆</span>
                        <span className="text-xs text-gray-400 hidden md:inline">7.5</span>
                      </div>
                      <p className="text-xs md:text-sm font-semibold text-gray-800 line-clamp-2 mb-1">{product.name}</p>
                      <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm">${product.price}</span>
                        {product.discount > 0 && (
                          <span className="bg-red-100 text-red-500 text-xs px-1.5 py-0.5 rounded-full">-{product.discount}%</span>
                        )}
                      </div>
                      <p className="text-xs text-green-600 mt-1">Free Shipping</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-center gap-1 mt-5 md:mt-6">
                <button className="w-8 h-8 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm">‹</button>
                {[1, 2, 3].map(p => (
                  <button key={p}
                    className={`w-8 h-8 rounded border text-sm font-medium
                      ${p === 1 ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                    {p}
                  </button>
                ))}
                <button className="w-8 h-8 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 text-sm">›</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter */}
      <div className="bg-gray-50 py-8 md:py-10 mt-8 border-t border-gray-200">
        <div className="max-w-lg mx-auto text-center px-4">
          <h2 className="font-bold text-lg md:text-xl mb-2">Subscribe on our newsletter</h2>
          <p className="text-gray-500 text-sm mb-5">Get daily news on upcoming offers from many suppliers all over the world</p>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
            <span className="px-3 md:px-4 text-gray-400 flex items-center">✉</span>
            <input placeholder="Email" className="flex-1 py-2.5 outline-none text-sm" />
            <button className="bg-blue-600 text-white px-4 md:px-7 py-2.5 text-sm hover:bg-blue-700 font-medium">Subscribe</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-8 md:py-10 px-4 md:px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8 md:gap-10">
            <div className="md:w-56 md:shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-blue-600 text-white p-2 rounded text-sm">🛒</div>
                <span className="font-bold text-blue-600 text-xl">Brand</span>
              </div>
              <p className="text-xs text-gray-500 mb-4 leading-relaxed">Best information about the company goes here but now lorem ipsum is</p>
            </div>
            <div className="grid grid-cols-2 md:flex md:flex-1 gap-6 md:gap-0">
              {[
                { title: 'About', links: ['About Us', 'Find store', 'Categories', 'Blogs'] },
                { title: 'Partnership', links: ['About Us', 'Find store', 'Categories', 'Blogs'] },
                { title: 'Information', links: ['Help Center', 'Money Refund', 'Shipping', 'Contact us'] },
                { title: 'For users', links: ['Login', 'Register', 'Settings', 'My Orders'] },
              ].map(col => (
                <div key={col.title} className="md:flex-1">
                  <h4 className="font-bold mb-3 text-sm text-gray-800">{col.title}</h4>
                  {col.links.map(link => (
                    <p key={link} className="text-xs text-gray-500 mb-2 hover:text-blue-600 cursor-pointer">{link}</p>
                  ))}
                </div>
              ))}
            </div>
            <div className="md:w-40 md:shrink-0">
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
          <div className="mt-8 pt-4 border-t border-gray-100 flex justify-between text-xs text-gray-400">
            <span>© 2026 Ecommerce.</span>
            <span>🇺🇸 English ▾</span>
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════
          MOBILE BOTTOM NAV BAR
      ══════════════════════════════════════ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 flex">
        <Link to="/" className="flex-1 flex flex-col items-center justify-center py-2 text-gray-500 hover:text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
          </svg>
          <span className="text-xs mt-0.5">Home</span>
        </Link>
        <Link to="/products" className="flex-1 flex flex-col items-center justify-center py-2 text-blue-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
          </svg>
          <span className="text-xs mt-0.5 font-medium">Browse</span>
        </Link>
        <Link to="/cart" className="flex-1 flex flex-col items-center justify-center py-2 text-gray-500 hover:text-blue-600">
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

      {/* Bottom spacer for mobile nav */}
      <div className="md:hidden h-16" />
    </div>
  )
}

export default ProductListing