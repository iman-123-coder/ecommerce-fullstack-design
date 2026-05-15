import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ProductListing from './pages/ProductListing'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AdminPanel from './pages/admin/AdminPanel'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login page opens first */}
        <Route path="/" element={<Login />} />

        {/* Other pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminPanel />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
