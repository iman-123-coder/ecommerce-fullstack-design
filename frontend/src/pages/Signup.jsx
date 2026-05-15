import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [focused, setFocused] = useState('')
  const [agreed, setAgreed] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!agreed) {
      setError('Please agree to the Terms & Privacy Policy.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
      setLoading(false)
    }
  }

  const passwordStrength = pw => {
    if (!pw) return 0
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    return s
  }
  const strength = passwordStrength(form.password)
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength]
  const strengthColor = ['', '#f43f5e', '#f59e0b', '#3b82f6', '#22c55e'][strength]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

        .signup-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background: #f0f4ff;
          display: flex;
          align-items: stretch;
        }

        /* ── LEFT PANEL ── */
        .signup-left {
          display: none;
          width: 46%;
          background: linear-gradient(145deg, #0f3460 0%, #1a56db 55%, #0ea5e9 100%);
          position: relative;
          overflow: hidden;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
        }
        @media (min-width: 768px) {
          .signup-left { display: flex; }
        }

        .left-glow-1 {
          position: absolute; width: 420px; height: 420px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.11) 0%, transparent 70%);
          top: -110px; right: -110px;
          animation: float1 8s ease-in-out infinite;
        }
        .left-glow-2 {
          position: absolute; width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(14,165,233,0.22) 0%, transparent 70%);
          bottom: 70px; left: -70px;
          animation: float2 11s ease-in-out infinite;
        }
        .left-glow-3 {
          position: absolute; width: 190px; height: 190px; border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%);
          bottom: 220px; right: 70px;
          animation: float1 6s ease-in-out infinite reverse;
        }

        @keyframes float1 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-28px) scale(1.05); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(18px) rotate(5deg); }
        }

        .left-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .left-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px; padding: 6px 16px;
          color: white; font-size: 13px; font-weight: 500; width: fit-content;
        }

        .left-heading {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(1.9rem, 2.8vw, 2.7rem);
          color: white; line-height: 1.2;
          margin: 1.5rem 0 1rem;
        }
        .left-heading em { font-style: italic; color: #7dd3fc; }

        .left-sub {
          color: rgba(255,255,255,0.65); font-size: 14.5px;
          line-height: 1.7; max-width: 330px;
        }

        /* Perks list */
        .perks-list {
          list-style: none; padding: 0; margin: 1.8rem 0 0;
          display: flex; flex-direction: column; gap: 14px;
        }
        .perk-item {
          display: flex; align-items: flex-start; gap: 12px;
        }
        .perk-icon {
          width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
          background: rgba(255,255,255,0.13);
          border: 1px solid rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center;
          font-size: 15px;
        }
        .perk-text strong {
          display: block; color: white; font-size: 13.5px; font-weight: 600;
        }
        .perk-text span {
          color: rgba(255,255,255,0.55); font-size: 12px;
        }

        .trust-row {
          display: flex; align-items: center; gap: 10px;
        }
        .trust-avatars { display: flex; }
        .trust-avatars span {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          background: linear-gradient(135deg, #60a5fa, #818cf8);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: white; font-weight: 600;
          margin-right: -8px;
        }
        .trust-text { color: rgba(255,255,255,0.7); font-size: 12px; margin-left: 16px; }
        .trust-text strong { color: white; }

        /* ── RIGHT PANEL ── */
        .signup-right {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 2rem 1.5rem; background: #f8faff;
          overflow-y: auto;
        }

        .signup-card {
          width: 100%; max-width: 430px;
          animation: fadeUp 0.5s ease both;
          padding: 0.5rem 0;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .brand-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 1.8rem;
        }
        .brand-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #1a56db, #0ea5e9);
          border-radius: 12px; display: flex; align-items: center; justify-content: center;
          font-size: 18px; box-shadow: 0 4px 14px rgba(26,86,219,0.35);
        }
        .brand-name { font-size: 20px; font-weight: 800; color: #1a56db; letter-spacing: -0.5px; }

        .card-title {
          font-size: 25px; font-weight: 800; color: #0f172a;
          letter-spacing: -0.5px; margin-bottom: 4px;
        }
        .card-sub { font-size: 14px; color: #64748b; margin-bottom: 1.6rem; }

        .error-box {
          background: #fff1f2; border: 1px solid #fecdd3;
          border-left: 3px solid #f43f5e; border-radius: 10px;
          padding: 11px 14px; font-size: 13px; color: #be123c;
          margin-bottom: 1.2rem; display: flex; align-items: center; gap: 8px;
        }

        /* Name row side by side on desktop */
        .field-row {
          display: grid; grid-template-columns: 1fr; gap: 0;
        }

        .field-wrap { margin-bottom: 1rem; }
        .field-label {
          font-size: 13px; font-weight: 600; color: #374151;
          margin-bottom: 6px; display: block;
        }
        .field-inner { position: relative; }

        .field-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: #94a3b8; pointer-events: none; transition: color 0.2s;
        }
        .field-icon.focused { color: #1a56db; }

        .field-input {
          width: 100%; border: 1.5px solid #e2e8f0; border-radius: 12px;
          padding: 12px 14px 12px 42px;
          font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif;
          background: white; color: #0f172a; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .field-input:focus {
          border-color: #1a56db;
          box-shadow: 0 0 0 3px rgba(26,86,219,0.1);
        }
        .field-input.has-right { padding-right: 44px; }
        .field-input::placeholder { color: #cbd5e1; }

        .pw-toggle {
          position: absolute; right: 13px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: #94a3b8;
          padding: 2px; display: flex; align-items: center;
        }
        .pw-toggle:hover { color: #1a56db; }

        /* Strength bar */
        .strength-wrap {
          margin-top: 8px; display: flex; align-items: center; gap: 8px;
        }
        .strength-bars {
          display: flex; gap: 4px; flex: 1;
        }
        .strength-bar {
          flex: 1; height: 4px; border-radius: 99px;
          background: #e2e8f0; transition: background 0.3s;
        }
        .strength-label {
          font-size: 11px; font-weight: 600; min-width: 38px; text-align: right;
        }

        /* Checkbox */
        .check-row {
          display: flex; align-items: flex-start; gap: 10px;
          margin-bottom: 1.3rem; margin-top: 0.3rem;
        }
        .check-box {
          width: 18px; height: 18px; border: 1.5px solid #d1d5db; border-radius: 5px;
          background: white; cursor: pointer; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.2s, background 0.2s;
          margin-top: 1px;
        }
        .check-box.checked {
          background: linear-gradient(135deg, #1a56db, #0ea5e9);
          border-color: #1a56db;
        }
        .check-text { font-size: 12.5px; color: #64748b; line-height: 1.5; }
        .check-text a { color: #1a56db; text-decoration: none; font-weight: 500; }
        .check-text a:hover { text-decoration: underline; }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #1a56db, #0ea5e9);
          color: white; border: none; border-radius: 12px; padding: 14px;
          font-size: 15px; font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer; position: relative; overflow: hidden;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 18px rgba(26,86,219,0.3); letter-spacing: 0.2px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(26,86,219,0.4);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .submit-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.12));
          pointer-events: none;
        }

        .spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white; border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px; vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 1.3rem 0; color: #cbd5e1; font-size: 12px;
        }
        .divider::before, .divider::after {
          content: ''; flex: 1; height: 1px; background: #e2e8f0;
        }

        .social-row { display: flex; gap: 10px; margin-bottom: 1.3rem; }
        .social-btn {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
          border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 11px 12px;
          font-size: 13px; font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #374151; background: white; cursor: pointer;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .social-btn:hover {
          border-color: #bfdbfe; background: #f0f7ff;
          box-shadow: 0 2px 8px rgba(26,86,219,0.08);
        }

        .signin-row {
          text-align: center; font-size: 13.5px; color: #64748b; margin-top: 1.3rem;
        }
        .signin-link { color: #1a56db; font-weight: 700; text-decoration: none; }
        .signin-link:hover { text-decoration: underline; }

        .back-home {
          display: flex; align-items: center; justify-content: center; gap: 5px;
          margin-top: 12px; font-size: 13px; color: #94a3b8; text-decoration: none;
          transition: color 0.2s;
        }
        .back-home:hover { color: #1a56db; }

        @media (max-width: 480px) {
          .signup-right { padding: 1.5rem 1rem; align-items: flex-start; padding-top: 2rem; }
          .card-title { font-size: 21px; }
          .submit-btn { padding: 13px; font-size: 14px; }
        }
      `}</style>

      <div className="signup-root">

        {/* ── LEFT PANEL ── */}
        <div className="signup-left">
          <div className="left-grid" />
          <div className="left-glow-1" />
          <div className="left-glow-2" />
          <div className="left-glow-3" />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="left-badge">
              <span>✦</span>
              <span>Join 2M+ happy shoppers</span>
            </div>
            <h2 className="left-heading">
              Start your<br/>
              journey <em>today</em> —<br/>
              it's free.
            </h2>
            <p className="left-sub">
              Create your account in seconds and unlock exclusive deals, fast checkout, and personalised recommendations.
            </p>

            <ul className="perks-list">
              {[
                { icon: '🎁', title: 'Welcome offer', desc: '10% off your first order' },
                { icon: '🚚', title: 'Free shipping', desc: 'On orders over $50' },
                { icon: '🔒', title: 'Secure & private', desc: 'Your data stays yours' },
                { icon: '⚡', title: 'Instant access', desc: 'No waiting, shop right away' },
              ].map(p => (
                <li key={p.title} className="perk-item">
                  <div className="perk-icon">{p.icon}</div>
                  <div className="perk-text">
                    <strong>{p.title}</strong>
                    <span>{p.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="trust-row" style={{ position: 'relative', zIndex: 1 }}>
            <div className="trust-avatars">
              {['AK','BR','CM','DS'].map(a => <span key={a}>{a}</span>)}
            </div>
            <p className="trust-text"><strong>4.9/5</strong> from 12,000+ reviews</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="signup-right">
          <div className="signup-card">

            {/* Brand */}
            <div className="brand-row">
              <div className="brand-icon">🛒</div>
              <span className="brand-name">Brand</span>
            </div>

            <h1 className="card-title">Create your account</h1>
            <p className="card-sub">Join for free and start shopping smarter</p>

            {/* Error */}
            {error && (
              <div className="error-box">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {error}
              </div>
            )}

            {/* Social signup */}
            <div className="social-row">
              <button className="social-btn">
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </button>
              <button className="social-btn">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

            <div className="divider">or sign up with email</div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Full Name */}
              <div className="field-wrap">
                <label className="field-label">Full name</label>
                <div className="field-inner">
                  <span className={`field-icon ${focused === 'name' ? 'focused' : ''}`}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                    placeholder="John Doe"
                    className="field-input"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="field-wrap">
                <label className="field-label">Email address</label>
                <div className="field-inner">
                  <span className={`field-icon ${focused === 'email' ? 'focused' : ''}`}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused('')}
                    placeholder="you@example.com"
                    className="field-input"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="field-wrap">
                <label className="field-label">Password</label>
                <div className="field-inner">
                  <span className={`field-icon ${focused === 'password' ? 'focused' : ''}`}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused('')}
                    placeholder="Min. 8 characters"
                    className="field-input has-right"
                    required
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
                {/* Strength meter */}
                {form.password && (
                  <div className="strength-wrap">
                    <div className="strength-bars">
                      {[1,2,3,4].map(i => (
                        <div
                          key={i}
                          className="strength-bar"
                          style={{ background: i <= strength ? strengthColor : '#e2e8f0' }}
                        />
                      ))}
                    </div>
                    <span className="strength-label" style={{ color: strengthColor }}>{strengthLabel}</span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="field-wrap">
                <label className="field-label">Confirm password</label>
                <div className="field-inner">
                  <span className={`field-icon ${focused === 'confirm' ? 'focused' : ''}`}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                    </svg>
                  </span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocused('confirm')}
                    onBlur={() => setFocused('')}
                    placeholder="Re-enter your password"
                    className="field-input has-right"
                    required
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? (
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
                {/* Match indicator */}
                {form.confirmPassword && (
                  <div style={{ marginTop: 6, fontSize: 12, display: 'flex', alignItems: 'center', gap: 5,
                    color: form.password === form.confirmPassword ? '#22c55e' : '#f43f5e' }}>
                    {form.password === form.confirmPassword ? (
                      <><svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                      </svg> Passwords match</>
                    ) : (
                      <><svg width="13" height="13" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                      </svg> Passwords don't match</>
                    )}
                  </div>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="check-row">
                <div
                  className={`check-box ${agreed ? 'checked' : ''}`}
                  onClick={() => setAgreed(!agreed)}
                >
                  {agreed && (
                    <svg width="11" height="11" fill="none" stroke="white" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                    </svg>
                  )}
                </div>
                <p className="check-text">
                  I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. I confirm I'm 18+ years old.
                </p>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <><span className="spinner"></span>Creating account…</>
                ) : (
                  'Create Account →'
                )}
              </button>
            </form>

            {/* Sign in */}
            <p className="signin-row">
              Already have an account?{' '}
              <Link to="/login" className="signin-link">Sign in</Link>
            </p>

            {/* Back home */}
            <Link to="/" className="back-home">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Back to Home
            </Link>

          </div>
        </div>
      </div>
    </>
  )
}

export default Signup