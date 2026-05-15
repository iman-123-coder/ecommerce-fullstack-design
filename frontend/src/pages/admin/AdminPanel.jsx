import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const AdminPanel = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('products')
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [toast, setToast] = useState(null)
  const [form, setForm] = useState({
    name: '', price: '', image: '', description: '',
    category: '', stock: '', discount: '', featured: false
  })
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    if (!user || user.role !== 'admin') navigate('/login')
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products')
      setProducts(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleChange = e => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: val })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    try {
      if (editProduct) {
        await axios.put(`http://localhost:5000/api/products/${editProduct.id}`, form, {
          headers: { Authorization: `Bearer ${token}` }
        })
        showToast('Product updated successfully!')
      } else {
        await axios.post('http://localhost:5000/api/products', form, {
          headers: { Authorization: `Bearer ${token}` }
        })
        showToast('Product added successfully!')
      }
      setShowForm(false)
      setEditProduct(null)
      resetForm()
      fetchProducts()
    } catch (err) {
      showToast(err.response?.data?.message || 'Error saving product', 'error')
    }
  }

  const resetForm = () => setForm({
    name: '', price: '', image: '', description: '',
    category: '', stock: '', discount: '', featured: false
  })

  const handleEdit = product => {
    setEditProduct(product)
    setForm(product)
    setShowForm(true)
    setSidebarOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async id => {
    const token = localStorage.getItem('token')
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      showToast('Product deleted.')
      setDeleteConfirm(null)
      fetchProducts()
    } catch {
      showToast('Error deleting product', 'error')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalStock = products.reduce((s, p) => s + (Number(p.stock) || 0), 0)
  const totalValue = products.reduce((s, p) => s + (Number(p.price) || 0) * (Number(p.stock) || 0), 0)
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .adm-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #f0f2f8;
          display: flex;
          color: #1e293b;
        }

        /* ── SIDEBAR ── */
        .adm-sidebar {
          width: 240px;
          background: linear-gradient(175deg, #0f2557 0%, #1a3a8f 60%, #1e4db7 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0; top: 0; bottom: 0;
          z-index: 50;
          transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        @media (max-width: 900px) {
          .adm-sidebar { transform: translateX(-100%); }
          .adm-sidebar.open { transform: translateX(0); box-shadow: 8px 0 40px rgba(0,0,0,0.25); }
        }

        .sidebar-brand {
          padding: 24px 20px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          display: flex; align-items: center; gap: 10px;
        }
        .sidebar-brand-icon {
          width: 38px; height: 38px; background: rgba(255,255,255,0.15);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          font-size: 18px; backdrop-filter: blur(6px);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .sidebar-brand-text { font-family: 'Syne', sans-serif; font-size: 17px; color: white; font-weight: 800; }
        .sidebar-brand-sub { font-size: 10px; color: rgba(255,255,255,0.45); letter-spacing: 1px; text-transform: uppercase; }

        .sidebar-section-label {
          padding: 18px 20px 8px;
          font-size: 10px; font-weight: 700; letter-spacing: 1.5px;
          text-transform: uppercase; color: rgba(255,255,255,0.35);
        }

        .sidebar-nav { flex: 1; padding: 0 10px; }
        .sidebar-item {
          display: flex; align-items: center; gap: 11px;
          padding: 11px 14px; border-radius: 10px;
          font-size: 14px; font-weight: 500;
          color: rgba(255,255,255,0.6); cursor: pointer;
          transition: all 0.18s;
          margin-bottom: 2px;
          text-decoration: none;
        }
        .sidebar-item:hover { background: rgba(255,255,255,0.08); color: white; }
        .sidebar-item.active { background: rgba(255,255,255,0.14); color: white; font-weight: 600; }
        .sidebar-item .s-icon {
          width: 32px; height: 32px; border-radius: 8px;
          background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }
        .sidebar-item.active .s-icon { background: rgba(255,255,255,0.18); }

        .sidebar-badge {
          margin-left: auto; background: rgba(255,255,255,0.15); color: white;
          font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 99px;
        }

        .sidebar-footer {
          padding: 14px 10px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }
        .sidebar-user {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px;
          background: rgba(255,255,255,0.07);
          margin-bottom: 8px;
        }
        .sidebar-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, #60a5fa, #818cf8);
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; color: white; flex-shrink: 0;
        }
        .sidebar-user-name { font-size: 13px; font-weight: 600; color: white; }
        .sidebar-user-role { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 0.5px; }
        .sidebar-logout {
          width: 100%; display: flex; align-items: center; gap: 9px;
          padding: 10px 12px; border-radius: 10px; border: none; cursor: pointer;
          background: rgba(239,68,68,0.12); color: #fca5a5;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          transition: background 0.18s;
        }
        .sidebar-logout:hover { background: rgba(239,68,68,0.22); }

        /* ── OVERLAY ── */
        .sidebar-overlay {
          display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          z-index: 40; backdrop-filter: blur(3px);
        }
        @media (max-width: 900px) {
          .sidebar-overlay.show { display: block; }
        }

        /* ── MAIN ── */
        .adm-main {
          margin-left: 240px;
          flex: 1; min-width: 0;
          display: flex; flex-direction: column;
        }
        @media (max-width: 900px) { .adm-main { margin-left: 0; } }

        /* ── TOPBAR ── */
        .adm-topbar {
          background: white;
          border-bottom: 1px solid #e8ecf5;
          padding: 0 24px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 30;
          box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .topbar-left { display: flex; align-items: center; gap: 14px; }
        .hamburger {
          display: none; background: none; border: none; cursor: pointer;
          padding: 8px; border-radius: 8px; color: #64748b;
          transition: background 0.15s;
        }
        .hamburger:hover { background: #f1f5f9; }
        @media (max-width: 900px) { .hamburger { display: flex; align-items: center; } }

        .topbar-title {
          font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #0f172a;
        }
        .topbar-breadcrumb {
          font-size: 12px; color: #94a3b8; display: flex; align-items: center; gap: 5px;
        }

        .topbar-right { display: flex; align-items: center; gap: 10px; }
        .topbar-search {
          display: flex; align-items: center; gap: 8px;
          background: #f8faff; border: 1.5px solid #e8ecf5; border-radius: 10px;
          padding: 8px 12px; transition: border-color 0.2s;
        }
        .topbar-search:focus-within { border-color: #1a56db; }
        .topbar-search input {
          border: none; background: none; outline: none; font-size: 13px;
          font-family: 'DM Sans', sans-serif; color: #0f172a; width: 180px;
        }
        .topbar-search input::placeholder { color: #94a3b8; }
        @media (max-width: 540px) {
          .topbar-search { display: none; }
          .topbar-title { font-size: 15px; }
        }

        .topbar-bell {
          width: 36px; height: 36px; border-radius: 10px;
          background: #f1f5f9; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #64748b; position: relative; transition: background 0.15s;
        }
        .topbar-bell:hover { background: #e2e8f0; }
        .bell-dot {
          width: 8px; height: 8px; background: #ef4444; border-radius: 50%;
          position: absolute; top: 6px; right: 6px;
          border: 1.5px solid white;
        }

        .add-btn {
          display: flex; align-items: center; gap: 7px;
          background: linear-gradient(135deg, #1a3a8f, #1e4db7);
          color: white; border: none; border-radius: 10px;
          padding: 9px 16px; font-size: 13px; font-weight: 700;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 3px 12px rgba(26,77,183,0.3);
        }
        .add-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 18px rgba(26,77,183,0.4); }

        /* ── PAGE CONTENT ── */
        .adm-content { padding: 24px; flex: 1; }
        @media (max-width: 540px) { .adm-content { padding: 16px; } }

        /* ── STATS ── */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px; margin-bottom: 24px;
        }
        @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }

        .stat-card {
          background: white; border-radius: 16px;
          padding: 20px; border: 1px solid #e8ecf5;
          position: relative; overflow: hidden;
          animation: fadeUp 0.4s ease both;
        }
        .stat-card:nth-child(1) { animation-delay: 0.05s; }
        .stat-card:nth-child(2) { animation-delay: 0.1s; }
        .stat-card:nth-child(3) { animation-delay: 0.15s; }
        .stat-card:nth-child(4) { animation-delay: 0.2s; }

        .stat-card::before {
          content: ''; position: absolute; top: -20px; right: -20px;
          width: 80px; height: 80px; border-radius: 50%;
          opacity: 0.07;
        }
        .stat-card.blue::before { background: #1a56db; }
        .stat-card.green::before { background: #22c55e; }
        .stat-card.amber::before { background: #f59e0b; }
        .stat-card.rose::before { background: #f43f5e; }

        .stat-icon {
          width: 40px; height: 40px; border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; margin-bottom: 14px;
        }
        .stat-icon.blue { background: #eff6ff; }
        .stat-icon.green { background: #f0fdf4; }
        .stat-icon.amber { background: #fffbeb; }
        .stat-icon.rose { background: #fff1f2; }

        .stat-val {
          font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800;
          color: #0f172a; line-height: 1;
        }
        @media (max-width: 480px) { .stat-val { font-size: 19px; } }
        .stat-lbl { font-size: 12px; color: #94a3b8; margin-top: 4px; font-weight: 500; }
        .stat-trend {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 11px; font-weight: 700; margin-top: 8px;
          padding: 2px 7px; border-radius: 99px;
        }
        .stat-trend.up { background: #f0fdf4; color: #16a34a; }
        .stat-trend.neutral { background: #f8faff; color: #64748b; }

        /* ── FORM PANEL ── */
        .form-panel {
          background: white; border-radius: 18px; border: 1px solid #e8ecf5;
          margin-bottom: 24px; overflow: hidden;
          animation: slideDown 0.35s cubic-bezier(0.4,0,0.2,1) both;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .form-header {
          background: linear-gradient(135deg, #f8faff, #eff6ff);
          border-bottom: 1px solid #e8ecf5;
          padding: 18px 24px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .form-title {
          font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #0f172a;
          display: flex; align-items: center; gap: 8px;
        }
        .form-title-badge {
          font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: 99px;
          font-family: 'DM Sans', sans-serif;
        }
        .form-title-badge.edit { background: #fef9c3; color: #a16207; }
        .form-title-badge.add { background: #dbeafe; color: #1d4ed8; }

        .form-close {
          width: 32px; height: 32px; border-radius: 8px; border: 1.5px solid #e2e8f0;
          background: white; cursor: pointer; display: flex; align-items: center; justify-content: center;
          color: #64748b; font-size: 16px; transition: all 0.15s;
        }
        .form-close:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }

        .form-body { padding: 24px; }
        .form-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }

        .form-group { display: flex; flex-direction: column; }
        .form-group.full { grid-column: 1 / -1; }
        .form-label {
          font-size: 12px; font-weight: 700; color: #374151;
          margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .form-input, .form-textarea {
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          padding: 11px 14px; font-size: 14px;
          font-family: 'DM Sans', sans-serif; color: #0f172a;
          background: #fafbff; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .form-input:focus, .form-textarea:focus {
          border-color: #1a56db; background: white;
          box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
        }
        .form-input::placeholder, .form-textarea::placeholder { color: #cbd5e1; }
        .form-textarea { resize: vertical; min-height: 90px; }

        .featured-row {
          display: flex; align-items: center; gap: 10px;
          padding: 12px 14px; background: #fafbff;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          cursor: pointer; transition: border-color 0.2s;
        }
        .featured-row:hover { border-color: #1a56db; }
        .featured-toggle {
          width: 38px; height: 22px; border-radius: 99px;
          background: #e2e8f0; position: relative;
          transition: background 0.2s; flex-shrink: 0;
        }
        .featured-toggle.on { background: linear-gradient(135deg, #1a56db, #0ea5e9); }
        .featured-toggle::after {
          content: ''; position: absolute; top: 3px; left: 3px;
          width: 16px; height: 16px; border-radius: 50%;
          background: white; transition: transform 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .featured-toggle.on::after { transform: translateX(16px); }
        .featured-label { font-size: 13px; font-weight: 500; color: #374151; }

        .form-actions {
          display: flex; gap: 10px; margin-top: 20px;
          flex-wrap: wrap;
        }
        .btn-primary {
          display: flex; align-items: center; gap: 7px;
          background: linear-gradient(135deg, #1a3a8f, #1e4db7);
          color: white; border: none; border-radius: 10px;
          padding: 12px 22px; font-size: 14px; font-weight: 700;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
          box-shadow: 0 3px 12px rgba(26,77,183,0.3);
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 5px 18px rgba(26,77,183,0.4); }

        .btn-secondary {
          display: flex; align-items: center; gap: 7px;
          background: white; color: #64748b;
          border: 1.5px solid #e2e8f0; border-radius: 10px;
          padding: 12px 22px; font-size: 14px; font-weight: 600;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .btn-secondary:hover { border-color: #94a3b8; background: #f8fafc; }

        /* ── TABLE SECTION ── */
        .table-section {
          background: white; border-radius: 18px; border: 1px solid #e8ecf5;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.04);
          animation: fadeUp 0.5s ease 0.25s both;
        }

        .table-toolbar {
          padding: 16px 20px; border-bottom: 1px solid #f1f5f9;
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          flex-wrap: wrap;
        }
        .table-title {
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: #0f172a;
          display: flex; align-items: center; gap: 8px;
        }
        .table-count {
          font-size: 12px; font-weight: 600; padding: 3px 9px;
          background: #eff6ff; color: #1d4ed8; border-radius: 99px;
          font-family: 'DM Sans', sans-serif;
        }
        .mobile-search {
          display: none; align-items: center; gap: 7px;
          background: #f8faff; border: 1.5px solid #e8ecf5; border-radius: 10px;
          padding: 7px 12px; flex: 1; min-width: 0;
        }
        .mobile-search input {
          border: none; background: none; outline: none; font-size: 13px;
          font-family: 'DM Sans', sans-serif; color: #0f172a; width: 100%;
        }
        .mobile-search input::placeholder { color: #94a3b8; }
        @media (max-width: 540px) { .mobile-search { display: flex; } }

        /* Desktop table */
        .desktop-table { width: 100%; border-collapse: collapse; }
        @media (max-width: 700px) { .desktop-table { display: none; } }
        .desktop-table thead tr {
          background: #f8faff; border-bottom: 1px solid #e8ecf5;
        }
        .desktop-table th {
          text-align: left; padding: 13px 16px;
          font-size: 11px; font-weight: 700; color: #94a3b8;
          text-transform: uppercase; letter-spacing: 0.8px;
        }
        .desktop-table tbody tr {
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.15s;
        }
        .desktop-table tbody tr:hover { background: #fafbff; }
        .desktop-table tbody tr:last-child { border-bottom: none; }
        .desktop-table td { padding: 13px 16px; vertical-align: middle; }

        .product-img {
          width: 46px; height: 46px; border-radius: 10px;
          object-fit: contain; background: #f8faff;
          border: 1px solid #e8ecf5; padding: 3px;
        }
        .product-img-placeholder {
          width: 46px; height: 46px; border-radius: 10px;
          background: #f1f5f9; border: 1px solid #e8ecf5;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; flex-shrink: 0;
        }
        .product-name { font-weight: 600; color: #0f172a; font-size: 14px; }
        .product-desc { font-size: 12px; color: #94a3b8; margin-top: 2px;
          max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

        .price-badge {
          font-weight: 700; color: #1a56db; font-size: 14px;
        }
        .category-chip {
          display: inline-block; padding: 3px 10px; border-radius: 99px;
          background: #eff6ff; color: #1d4ed8; font-size: 11px; font-weight: 600;
        }
        .stock-val {
          font-weight: 600; font-size: 14px;
          padding: 3px 10px; border-radius: 6px; display: inline-block;
        }
        .stock-val.ok { background: #f0fdf4; color: #16a34a; }
        .stock-val.low { background: #fff7ed; color: #c2410c; }
        .stock-val.out { background: #fff1f2; color: #be123c; }

        .featured-chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 9px; border-radius: 99px;
          background: #fef9c3; color: #a16207; font-size: 11px; font-weight: 600;
        }

        .action-btn {
          border: none; border-radius: 8px;
          padding: 7px 13px; font-size: 12px; font-weight: 700;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          display: inline-flex; align-items: center; gap: 5px;
          transition: transform 0.12s, box-shadow 0.12s;
        }
        .action-btn:hover { transform: translateY(-1px); }
        .btn-edit {
          background: #fef9c3; color: #a16207;
          box-shadow: 0 1px 4px rgba(161,98,7,0.15);
        }
        .btn-edit:hover { box-shadow: 0 3px 8px rgba(161,98,7,0.25); }
        .btn-del {
          background: #fff1f2; color: #be123c;
          box-shadow: 0 1px 4px rgba(190,18,60,0.15);
        }
        .btn-del:hover { box-shadow: 0 3px 8px rgba(190,18,60,0.25); }

        /* ── MOBILE CARDS ── */
        .mobile-cards { display: none; }
        @media (max-width: 700px) { .mobile-cards { display: block; } }

        .mobile-card {
          padding: 16px; border-bottom: 1px solid #f1f5f9;
          display: flex; gap: 14px; align-items: flex-start;
          transition: background 0.15s;
        }
        .mobile-card:hover { background: #fafbff; }
        .mobile-card:last-child { border-bottom: none; }
        .mobile-card-img {
          width: 54px; height: 54px; border-radius: 12px; flex-shrink: 0;
          object-fit: contain; background: #f8faff; border: 1px solid #e8ecf5; padding: 4px;
        }
        .mobile-card-body { flex: 1; min-width: 0; }
        .mobile-card-name { font-weight: 700; color: #0f172a; font-size: 14px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mobile-card-meta { font-size: 12px; color: #94a3b8; margin-top: 3px; }
        .mobile-card-row {
          display: flex; align-items: center; gap: 8px; margin-top: 10px; flex-wrap: wrap;
        }
        .mobile-card-price { font-weight: 700; color: #1a56db; font-size: 15px; }
        .mobile-actions { display: flex; gap: 6px; margin-top: 10px; }

        /* ── EMPTY STATE ── */
        .empty-state {
          padding: 60px 20px; text-align: center;
        }
        .empty-icon { font-size: 48px; margin-bottom: 12px; }
        .empty-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: #0f172a; }
        .empty-sub { font-size: 14px; color: #94a3b8; margin-top: 6px; }

        /* ── DELETE MODAL ── */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.45);
          z-index: 100; display: flex; align-items: center; justify-content: center;
          padding: 20px; backdrop-filter: blur(4px);
          animation: fadeIn 0.2s ease;
        }
        .modal-box {
          background: white; border-radius: 20px; padding: 32px;
          max-width: 380px; width: 100%; text-align: center;
          animation: popIn 0.25s cubic-bezier(0.4,0,0.2,1);
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .modal-icon {
          width: 60px; height: 60px; border-radius: 50%;
          background: #fff1f2; display: flex; align-items: center; justify-content: center;
          font-size: 26px; margin: 0 auto 18px;
        }
        .modal-title { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #0f172a; }
        .modal-sub { font-size: 14px; color: #64748b; margin-top: 8px; line-height: 1.5; }
        .modal-btns { display: flex; gap: 10px; margin-top: 24px; }
        .modal-cancel {
          flex: 1; padding: 12px; border-radius: 10px;
          border: 1.5px solid #e2e8f0; background: white;
          font-size: 14px; font-weight: 600; font-family: 'DM Sans', sans-serif;
          color: #64748b; cursor: pointer; transition: border-color 0.15s;
        }
        .modal-cancel:hover { border-color: #94a3b8; }
        .modal-delete {
          flex: 1; padding: 12px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #dc2626, #f43f5e);
          color: white; font-size: 14px; font-weight: 700;
          font-family: 'DM Sans', sans-serif; cursor: pointer;
          box-shadow: 0 3px 12px rgba(220,38,38,0.3);
          transition: transform 0.15s;
        }
        .modal-delete:hover { transform: translateY(-1px); }

        /* ── TOAST ── */
        .toast {
          position: fixed; bottom: 24px; right: 24px; z-index: 200;
          display: flex; align-items: center; gap: 10px;
          background: white; border-radius: 12px; padding: 14px 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12); border: 1px solid #e8ecf5;
          animation: toastIn 0.35s cubic-bezier(0.4,0,0.2,1);
          min-width: 240px; max-width: 340px;
          font-size: 14px; font-weight: 500;
        }
        .toast.success { border-left: 3px solid #22c55e; }
        .toast.error { border-left: 3px solid #f43f5e; }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .toast-icon { font-size: 18px; flex-shrink: 0; }

        /* ── LOADING ── */
        .skeleton-row td { padding: 14px 16px; }
        .skeleton { background: linear-gradient(90deg, #f1f5f9 25%, #e8ecf5 50%, #f1f5f9 75%);
          background-size: 200% 100%; animation: shimmer 1.5s infinite;
          border-radius: 6px; height: 16px; }
        .skeleton.img { width: 46px; height: 46px; border-radius: 10px; }
        @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
      `}</style>

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">🗑️</div>
            <div className="modal-title">Delete Product?</div>
            <p className="modal-sub">
              <strong>"{deleteConfirm.name}"</strong> will be permanently removed. This action cannot be undone.
            </p>
            <div className="modal-btns">
              <button className="modal-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="modal-delete" onClick={() => handleDelete(deleteConfirm.id)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-icon">{toast.type === 'success' ? '✅' : '❌'}</span>
          {toast.msg}
        </div>
      )}

      <div className="adm-root">
        {/* ── SIDEBAR OVERLAY ── */}
        <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />

        {/* ── SIDEBAR ── */}
        <aside className={`adm-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-brand">
            <div className="sidebar-brand-icon">🛒</div>
            <div>
              <div className="sidebar-brand-text">Brand</div>
              <div className="sidebar-brand-sub">Admin Console</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="sidebar-section-label">Main Menu</div>
            {[
              { id: 'dashboard', icon: '📊', label: 'Dashboard' },
              { id: 'products', icon: '📦', label: 'Products', count: products.length },
              { id: 'orders', icon: '🛍️', label: 'Orders', count: 0 },
              { id: 'customers', icon: '👥', label: 'Customers', count: 0 },
            ].map(item => (
              <div
                key={item.id}
                className={`sidebar-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              >
                <span className="s-icon">{item.icon}</span>
                {item.label}
                {item.count > 0 && <span className="sidebar-badge">{item.count}</span>}
              </div>
            ))}

            <div className="sidebar-section-label">Store</div>
            <Link to="/" className="sidebar-item" onClick={() => setSidebarOpen(false)}>
              <span className="s-icon">🏪</span>
              View Store
            </Link>
            <div className="sidebar-item">
              <span className="s-icon">⚙️</span>
              Settings
            </div>
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-avatar">
                {(user.name || 'A')[0].toUpperCase()}
              </div>
              <div>
                <div className="sidebar-user-name">{user.name || 'Admin'}</div>
                <div className="sidebar-user-role">Administrator</div>
              </div>
            </div>
            <button className="sidebar-logout" onClick={handleLogout}>
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN ── */}
        <main className="adm-main">
          {/* TOPBAR */}
          <header className="adm-topbar">
            <div className="topbar-left">
              <button className="hamburger" onClick={() => setSidebarOpen(true)}>
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
              <div>
                <div className="topbar-title">Products</div>
                <div className="topbar-breadcrumb">
                  <span>Admin</span>
                  <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                  <span style={{ color: '#1a56db' }}>Products</span>
                </div>
              </div>
            </div>
            <div className="topbar-right">
              <div className="topbar-search">
                <svg width="14" height="14" fill="none" stroke="#94a3b8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="topbar-bell">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
                <span className="bell-dot" />
              </button>
              <button
                className="add-btn"
                onClick={() => { setShowForm(true); setEditProduct(null); resetForm(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
              >
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
                </svg>
                <span>Add Product</span>
              </button>
            </div>
          </header>

          <div className="adm-content">
            {/* STATS */}
            <div className="stats-grid">
              {[
                { color: 'blue', icon: '📦', val: products.length, lbl: 'Total Products', trend: 'up', trendVal: '+3 this week' },
                { color: 'green', icon: '✅', val: totalStock, lbl: 'Units in Stock', trend: 'up', trendVal: 'All time' },
                { color: 'amber', icon: '🏷️', val: categories.length, lbl: 'Categories', trend: 'neutral', trendVal: 'Across all' },
                { color: 'rose', icon: '💰', val: `$${totalValue.toLocaleString()}`, lbl: 'Inventory Value', trend: 'up', trendVal: 'Est. value' },
              ].map((s, i) => (
                <div key={i} className={`stat-card ${s.color}`}>
                  <div className={`stat-icon ${s.color}`}>{s.icon}</div>
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-lbl">{s.lbl}</div>
                  <span className={`stat-trend ${s.trend}`}>
                    {s.trend === 'up' ? '↑' : '—'} {s.trendVal}
                  </span>
                </div>
              ))}
            </div>

            {/* ADD/EDIT FORM */}
            {showForm && (
              <div className="form-panel">
                <div className="form-header">
                  <div className="form-title">
                    {editProduct ? '✏️ Edit Product' : '➕ New Product'}
                    <span className={`form-title-badge ${editProduct ? 'edit' : 'add'}`}>
                      {editProduct ? 'Editing' : 'Adding'}
                    </span>
                  </div>
                  <button className="form-close" onClick={() => { setShowForm(false); setEditProduct(null); resetForm(); }}>✕</button>
                </div>
                <div className="form-body">
                  <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Product Name *</label>
                        <input className="form-input" type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Wireless Earbuds Pro" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Price ($) *</label>
                        <input className="form-input" type="number" name="price" value={form.price} onChange={handleChange} placeholder="0.00" step="0.01" required />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Image URL</label>
                        <input className="form-input" type="text" name="image" value={form.image} onChange={handleChange} placeholder="https://images.unsplash.com/..." />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <input className="form-input" type="text" name="category" value={form.category} onChange={handleChange} placeholder="Electronics, Clothing…" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Stock Quantity</label>
                        <input className="form-input" type="number" name="stock" value={form.stock} onChange={handleChange} placeholder="0" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Discount (%)</label>
                        <input className="form-input" type="number" name="discount" value={form.discount} onChange={handleChange} placeholder="0" min="0" max="100" />
                      </div>
                      <div className="form-group full">
                        <label className="form-label">Description</label>
                        <textarea className="form-textarea" name="description" value={form.description} onChange={handleChange} placeholder="Describe the product…" />
                      </div>
                      <div className="form-group full">
                        <label className="form-label">Featured</label>
                        <div className="featured-row" onClick={() => setForm({ ...form, featured: !form.featured })}>
                          <div className={`featured-toggle ${form.featured ? 'on' : ''}`} />
                          <span className="featured-label">
                            {form.featured ? '⭐ Shown on homepage as featured product' : 'Not featured — click to enable'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn-primary">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                        </svg>
                        {editProduct ? 'Update Product' : 'Add Product'}
                      </button>
                      <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setEditProduct(null); resetForm(); }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* TABLE */}
            <div className="table-section">
              <div className="table-toolbar">
                <div className="table-title">
                  All Products
                  <span className="table-count">{filtered.length}</span>
                </div>
                <div className="mobile-search">
                  <svg width="13" height="13" fill="none" stroke="#94a3b8" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input placeholder="Search…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
              </div>

              {/* Desktop table */}
              <table className="desktop-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    [1,2,3,4].map(i => (
                      <tr key={i} className="skeleton-row">
                        <td><div className="skeleton img" /></td>
                        <td><div className="skeleton" style={{ width: 140 }} /></td>
                        <td><div className="skeleton" style={{ width: 60 }} /></td>
                        <td><div className="skeleton" style={{ width: 80 }} /></td>
                        <td><div className="skeleton" style={{ width: 50 }} /></td>
                        <td><div className="skeleton" style={{ width: 50 }} /></td>
                      </tr>
                    ))
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6}>
                        <div className="empty-state">
                          <div className="empty-icon">📭</div>
                          <div className="empty-title">{searchQuery ? 'No results found' : 'No products yet'}</div>
                          <p className="empty-sub">{searchQuery ? `No products match "${searchQuery}"` : 'Click "Add Product" to get started'}</p>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.map(p => {
                    const stockNum = Number(p.stock) || 0
                    const stockClass = stockNum === 0 ? 'out' : stockNum < 10 ? 'low' : 'ok'
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            {p.image
                              ? <img src={p.image} alt={p.name} className="product-img" />
                              : <div className="product-img-placeholder">📦</div>
                            }
                            <div>
                              <div className="product-name">{p.name}</div>
                              {p.description && <div className="product-desc">{p.description}</div>}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="price-badge">${Number(p.price).toFixed(2)}</div>
                          {p.discount > 0 && <div style={{ fontSize: 11, color: '#16a34a', marginTop: 2 }}>−{p.discount}% off</div>}
                        </td>
                        <td>{p.category ? <span className="category-chip">{p.category}</span> : <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                        <td><span className={`stock-val ${stockClass}`}>{stockNum}</span></td>
                        <td>
                          {p.featured
                            ? <span className="featured-chip">⭐ Featured</span>
                            : <span style={{ fontSize: 12, color: '#94a3b8' }}>Standard</span>
                          }
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button className="action-btn btn-edit" onClick={() => handleEdit(p)}>
                              ✏️ Edit
                            </button>
                            <button className="action-btn btn-del" onClick={() => setDeleteConfirm(p)}>
                              🗑️ Del
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>

              {/* Mobile cards */}
              <div className="mobile-cards">
                {loading ? (
                  <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>Loading products…</div>
                ) : filtered.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <div className="empty-title">{searchQuery ? 'No results' : 'No products'}</div>
                    <p className="empty-sub">{searchQuery ? `No match for "${searchQuery}"` : 'Tap "+ Add Product" above'}</p>
                  </div>
                ) : filtered.map(p => {
                  const stockNum = Number(p.stock) || 0
                  const stockClass = stockNum === 0 ? 'out' : stockNum < 10 ? 'low' : 'ok'
                  return (
                    <div key={p.id} className="mobile-card">
                      {p.image
                        ? <img src={p.image} alt={p.name} className="mobile-card-img" />
                        : <div style={{ width: 54, height: 54, borderRadius: 12, background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>📦</div>
                      }
                      <div className="mobile-card-body">
                        <div className="mobile-card-name">{p.name}</div>
                        <div className="mobile-card-meta">{p.category || 'Uncategorized'}</div>
                        <div className="mobile-card-row">
                          <span className="mobile-card-price">${Number(p.price).toFixed(2)}</span>
                          <span className={`stock-val ${stockClass}`} style={{ fontSize: 11 }}>Stock: {stockNum}</span>
                          {p.featured && <span className="featured-chip" style={{ fontSize: 10 }}>⭐ Featured</span>}
                        </div>
                        <div className="mobile-actions">
                          <button className="action-btn btn-edit" onClick={() => handleEdit(p)}>✏️ Edit</button>
                          <button className="action-btn btn-del" onClick={() => setDeleteConfirm(p)}>🗑️ Delete</button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default AdminPanel