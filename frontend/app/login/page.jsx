'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(formData);
      localStorage.setItem('mentixora_token', res.data.token);
      localStorage.setItem('mentixora_user', JSON.stringify({
        id: res.data.userId,
        username: res.data.username,
        email: res.data.email
      }));
      router.push('/feed');
    } catch (err) {
      setError(err.response?.data || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700&family=Rajdhani:wght@300;400;600&display=swap');
        body { margin: 0; background: #080f1f; }
        .page-wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #080f1f;
          font-family: 'Exo 2', sans-serif;
          position: relative;
          overflow: hidden;
        }
        .bg-glow {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,180,255,0.08) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .grid-lines {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0,140,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,140,255,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .card {
          position: relative;
          z-index: 2;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(0,180,255,0.15);
          border-radius: 16px;
          padding: 40px 36px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 0 60px rgba(0,100,255,0.08);
        }
        .logo-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 28px;
        }
        .brand {
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #fff;
          margin-top: 12px;
          text-shadow: 0 0 20px rgba(0,180,255,0.3);
        }
        .card-title {
          font-size: 18px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 6px;
          text-align: center;
        }
        .card-sub {
          font-size: 12px;
          color: #4B9FD5;
          text-align: center;
          margin-bottom: 28px;
          letter-spacing: 0.05em;
        }
        .input-group {
          margin-bottom: 16px;
        }
        .input-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #4B9FD5;
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        .input-field {
          width: 100%;
          padding: 12px 14px;
          background: rgba(0,130,255,0.06);
          border: 1px solid rgba(0,180,255,0.2);
          border-radius: 8px;
          color: #fff;
          font-family: 'Exo 2', sans-serif;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .input-field:focus {
          border-color: rgba(0,180,255,0.6);
          background: rgba(0,130,255,0.1);
        }
        .input-field::placeholder { color: #2a4a6a; }
        .error-msg {
          background: rgba(255,60,60,0.1);
          border: 1px solid rgba(255,60,60,0.3);
          border-radius: 8px;
          padding: 10px 14px;
          color: #ff6b6b;
          font-size: 13px;
          margin-bottom: 16px;
          text-align: center;
        }
        .btn-submit {
          width: 100%;
          padding: 13px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #0090ff, #00c6ff);
          color: #fff;
          font-family: 'Exo 2', sans-serif;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 4px 20px rgba(0,144,255,0.35);
          margin-top: 8px;
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,144,255,0.5);
        }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .divider {
          width: 60px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,180,255,0.4), transparent);
          margin: 24px auto;
        }
        .bottom-text {
          text-align: center;
          font-size: 13px;
          color: #2a4a6a;
        }
        .bottom-link {
          color: #00c6ff;
          cursor: pointer;
          font-weight: 600;
          text-decoration: none;
        }
        .bottom-link:hover { text-decoration: underline; }
      `}</style>

      <div className="page-wrap">
        <div className="grid-lines"></div>
        <div className="bg-glow"></div>

        <div className="card">
          {/* Logo */}
          <div className="logo-row">
            <svg width="52" height="60" viewBox="0 0 90 104" fill="none">
              <defs>
                <linearGradient id="lg1" x1="0" y1="0" x2="90" y2="104" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00d4ff"/>
                  <stop offset="55%" stopColor="#0072ff"/>
                  <stop offset="100%" stopColor="#0040cc"/>
                </linearGradient>
              </defs>
              <polygon points="45,2 87,25 87,79 45,102 3,79 3,25" fill="url(#lg1)"/>
              <path d="M24 68 L24 36 L38 57 L45 46 L52 57 L66 36 L66 68" stroke="#08122a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M45 46 L45 68" stroke="#08122a" strokeWidth="7" strokeLinecap="round" fill="none"/>
            </svg>
            <div className="brand">MENTIXORA</div>
          </div>

          <div className="card-title">Welcome Back</div>
          <div className="card-sub">SIGN IN TO YOUR ACCOUNT</div>

          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input
                className="input-field"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <input
                className="input-field"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="divider"></div>

          <div className="bottom-text">
            Don't have an account?{' '}
            <span className="bottom-link" onClick={() => router.push('/signup')}>
              Register here
            </span>
          </div>
        </div>
      </div>
    </>
  );
}