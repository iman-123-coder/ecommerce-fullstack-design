import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [focused, setFocused] = useState('')
  const navigate = useNavigate()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      if (res.data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@0;1&display=swap');

        .login-root {
          font-family: 'Plus Jakarta Sans', sans-serif;
          min-height: 100vh;
          background: #f0f4ff;
          display: flex;
          align-items: stretch;
        }

        /* Left panel */
        .login-left {
          display: none;
          width: 50%;
          background: linear-gradient(145deg, #0f3460 0%, #1a56db 50%, #0ea5e9 100%);
          position: relative;
          overflow: hidden;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
        }
        @media (min-width: 768px) {
          .login-left { display: flex; }
        }

        .left-glow-1 {
          position: absolute;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%);
          top: -100px; right: -100px;
          animation: float1 8s ease-in-out infinite;
        }
        .left-glow-2 {
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(14,165,233,0.25) 0%, transparent 70%);
          bottom: 80px; left: -60px;
          animation: float2 10s ease-in-out infinite;
        }
        .left-glow-3 {
          position: absolute;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.07) 0%, transparent 70%);
          bottom: 200px; right: 60px;
          animation: float1 6s ease-in-out infinite reverse;
        }

        @keyframes float1 {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(20px) rotate(5deg); }
        }

        .left-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        .left-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 100px;
          padding: 6px 16px;
          color: white;
          font-size: 13px;
          font-weight: 500;
          width: fit-content;
        }

        .left-heading {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2rem, 3vw, 2.8rem);
          color: white;
          line-height: 1.2;
          margin: 1.5rem 0 1rem;
        }
        .left-heading em {
          font-style: italic;
          color: #7dd3fc;
        }

        .left-sub {
          color: rgba(255,255,255,0.65);
          font-size: 15px;
          line-height: 1.7;
          max-width: 340px;
        }

        .stat-cards {
          display: flex;
          gap: 12px;
          margin-top: 2rem;
        }
        .stat-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 16px;
          padding: 16px 20px;
          flex: 1;
        }
        .stat-card .val {
          font-size: 22px;
          font-weight: 700;
          color: white;
        }
        .stat-card .lbl {
          font-size: 11px;
          color: rgba(255,255,255,0.55);
          margin-top: 2px;
        }

        .trust-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .trust-avatars {
          display: flex;
        }
        .trust-avatars span {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.3);
          background: linear-gradient(135deg, #60a5fa, #818cf8);
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; color: white; font-weight: 600;
          margin-right: -8px;
        }
        .trust-text {
          color: rgba(255,255,255,0.7);
          font-size: 12px;
          margin-left: 16px;
        }
        .trust-text strong { color: white; }

        /* Right panel */
        .login-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.5rem;
          background: #f8faff;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          animation: fadeUp 0.5s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .brand-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 2rem;
        }
        .brand-icon {
          width: 40px; height: 40px;
          background: linear-gradient(135deg, #1a56db, #0ea5e9);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 14px rgba(26,86,219,0.35);
        }
        .brand-name {
          font-size: 20px;
          font-weight: 800;
          color: #1a56db;
          letter-spacing: -0.5px;
        }

        .card-title {
          font-size: 26px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
          margin-bottom: 4px;
        }
        .card-sub {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 2rem;
        }

        .error-box {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          border-left: 3px solid #f43f5e;
          border-radius: 10px;
          padding: 12px 14px;
          font-size: 13px;
          color: #be123c;
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .field-wrap {
          margin-bottom: 1.1rem;
        }
        .field-label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
          display: block;
        }
        .field-inner {
          position: relative;
        }
        .field-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          pointer-events: none;
          transition: color 0.2s;
        }
        .field-icon.focused { color: #1a56db; }

        .field-input {
          width: 100%;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 13px 14px 13px 42px;
          font-size: 14px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: white;
          color: #0f172a;
          outline: none;
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
          position: absolute;
          right: 13px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 2px;
          display: flex;
          align-items: center;
        }
        .pw-toggle:hover { color: #1a56db; }

        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -6px;
          margin-bottom: 1.4rem;
        }
        .forgot-link {
          font-size: 13px;
          color: #1a56db;
          text-decoration: none;
          font-weight: 500;
        }
        .forgot-link:hover { text-decoration: underline; }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #1a56db, #0ea5e9);
          color: white;
          border: none;
          border-radius: 12px;
          padding: 14px;
          font-size: 15px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 18px rgba(26,86,219,0.3);
          letter-spacing: 0.2px;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(26,86,219,0.4);
        }
        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .submit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.12));
          pointer-events: none;
        }

        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px;
          vertical-align: middle;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 1.4rem 0;
          color: #cbd5e1;
          font-size: 12px;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .social-row {
          display: flex;
          gap: 10px;
          margin-bottom: 1.5rem;
        }
        .social-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          padding: 11px 12px;
          font-size: 13px;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #374151;
          background: white;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .social-btn:hover {
          border-color: #bfdbfe;
          background: #f0f7ff;
          box-shadow: 0 2px 8px rgba(26,86,219,0.08);
        }

        .signup-row {
          text-align: center;
          font-size: 13.5px;
          color: #64748b;
        }
        .signup-link {
          color: #1a56db;
          font-weight: 700;
          text-decoration: none;
        }
        .signup-link:hover { text-decoration: underline; }

        .back-home {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          margin-top: 12px;
          font-size: 13px;
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s;
        }
        .back-home:hover { color: #1a56db; }

        /* Mobile-specific tweaks */
        @media (max-width: 480px) {
          .login-right { padding: 1.5rem 1rem; align-items: flex-start; padding-top: 2.5rem; }
          .card-title { font-size: 22px; }
          .submit-btn { padding: 13px; font-size: 14px; }
        }
      `}</style>

      <div className="login-root">

        {/* ── LEFT PANEL (desktop only) ── */}
        <div className="login-left">
          <div className="left-grid" />
          <div className="left-glow-1" />
          <div className="left-glow-2" />
          <div className="left-glow-3" />

          {/* Top content */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="left-badge">
              <span>✦</span>
              <span>Trusted by 50,000+ shoppers</span>
            </div>
            <h2 className="left-heading">
              Shop smarter,<br/>
              save <em>more</em> every day.
            </h2>
            <p className="left-sub">
              Access exclusive deals, track your orders, and enjoy a seamless shopping experience — all in one place.
            </p>
            <div className="stat-cards">
              {[
                { val: '2M+', lbl: 'Products' },
                { val: '99%', lbl: 'Satisfaction' },
                { val: '24/7', lbl: 'Support' },
              ].map(s => (
                <div key={s.lbl} className="stat-card">
                  <div className="val">{s.val}</div>
                  <div className="lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom trust row */}
          <div className="trust-row" style={{ position: 'relative', zIndex: 1 }}>
            <div className="trust-avatars">
              {['AK','BR','CM','DS'].map(a => <span key={a}>{a}</span>)}
            </div>
            <p className="trust-text"><strong>4.9/5</strong> from 12,000+ reviews</p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="login-right">
          <div className="login-card">

            {/* Brand */}
            <div className="brand-row">
              <div className="brand-icon">🛒</div>
              <span className="brand-name">Brand</span>
            </div>

            <h1 className="card-title">Welcome back</h1>
            <p className="card-sub">Sign in to continue to your account</p>

            {/* Error */}
            {error && (
              <div className="error-box">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {error}
              </div>
            )}

            {/* Social login */}
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

            <div className="divider">or sign in with email</div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
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
                    placeholder="Enter your password"
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
              </div>

              {/* Forgot */}
              <div className="forgot-row">
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <><span className="spinner"></span>Signing in…</>
                ) : (
                  'Sign In →'
                )}
              </button>
            </form>

            {/* Sign up */}
            <p className="signup-row" style={{ marginTop: '1.4rem' }}>
              Don't have an account?{' '}
              <Link to="/signup" className="signup-link">Create one free</Link>
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

export default Login