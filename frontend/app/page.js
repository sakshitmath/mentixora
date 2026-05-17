'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SplashPage() {
  const router = useRouter();
  const [splashDone, setSplashDone] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSplashDone(true);
    }, 2800);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700&family=Rajdhani:wght@300;400;600&display=swap');

        body { margin: 0; background: #080f1f; }

        .splash-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #080f1f;
          position: relative;
          overflow: hidden;
          font-family: 'Exo 2', sans-serif;
        }

        .bg-glow {
          position: absolute;
          width: 500px; height: 500px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,180,255,0.10) 0%, rgba(0,80,200,0.06) 40%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          animation: pulseGlow 4s ease-in-out infinite;
        }

        .bg-glow2 {
          position: absolute;
          width: 700px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,200,180,0.07) 0%, transparent 65%);
          bottom: -80px; left: 50%;
          transform: translateX(-50%);
          pointer-events: none;
          animation: pulseGlow2 5s ease-in-out infinite;
        }

        .grid-lines {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0,140,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,140,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .hex-svg {
          filter: drop-shadow(0 0 18px rgba(0,180,255,0.45)) drop-shadow(0 0 40px rgba(0,120,220,0.22));
          animation: floatHex 3.5s ease-in-out infinite;
        }

        .logo-wrap {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          animation: fadeUp 0.8s cubic-bezier(0.22,1,0.36,1) both;
        }

        .brand-name {
          font-family: 'Exo 2', sans-serif;
          font-size: 34px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: #ffffff;
          margin-top: 18px;
          text-shadow: 0 0 30px rgba(0,180,255,0.3);
          animation: fadeUp 0.9s 0.1s cubic-bezier(0.22,1,0.36,1) both;
        }

        .tagline {
          font-family: 'Rajdhani', sans-serif;
          font-size: 13px;
          font-weight: 400;
          letter-spacing: 0.25em;
          color: #00e5c8;
          margin-top: 8px;
          text-transform: uppercase;
          animation: fadeUp 1s 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }

        .divider {
          width: 60px; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,180,255,0.6), transparent);
          margin: 22px auto;
          animation: fadeUp 1s 0.3s cubic-bezier(0.22,1,0.36,1) both;
        }

        .btn-row {
          display: flex;
          gap: 14px;
          animation: fadeUp 1s 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }

        .btn-primary {
          padding: 11px 32px;
          border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #0090ff 0%, #00c6ff 100%);
          color: #ffffff;
          font-family: 'Exo 2', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: transform 0.18s, box-shadow 0.18s;
          box-shadow: 0 4px 20px rgba(0,144,255,0.35);
          text-transform: uppercase;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,144,255,0.5);
        }

        .btn-secondary {
          padding: 11px 32px;
          border-radius: 8px;
          border: 1px solid rgba(0,180,255,0.35);
          background: rgba(0,130,255,0.08);
          color: #6ecfff;
          font-family: 'Exo 2', sans-serif;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: transform 0.18s, background 0.18s;
          text-transform: uppercase;
        }

        .btn-secondary:hover {
          transform: translateY(-2px);
          background: rgba(0,130,255,0.15);
          border-color: rgba(0,180,255,0.65);
        }

        .splash-overlay {
          position: fixed;
          inset: 0;
          background: #080f1f;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.7s ease;
        }

        .splash-overlay.hide {
          opacity: 0;
          pointer-events: none;
        }

        .splash-logo-anim {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .splash-progress {
          width: 120px; height: 2px;
          background: rgba(255,255,255,0.08);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 20px;
        }

        .splash-bar {
          height: 100%;
          background: linear-gradient(90deg, #0090ff, #00e5c8);
          border-radius: 2px;
          animation: barFill 2.6s ease-in-out forwards;
        }

        .splash-brand {
          font-family: 'Exo 2', sans-serif;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.18em;
          text-shadow: 0 0 20px rgba(0,180,255,0.4);
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes floatHex {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: 0.7; transform: translate(-50%,-50%) scale(1); }
          50%       { opacity: 1;   transform: translate(-50%,-50%) scale(1.12); }
        }

        @keyframes pulseGlow2 {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }

        @keyframes barFill {
          0%   { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>

      <div className="splash-root">
        <div className="grid-lines"></div>
        <div className="bg-glow"></div>
        <div className="bg-glow2"></div>

        {/* Splash overlay — shows for 2.8 seconds then fades out */}
        <div className={`splash-overlay ${splashDone ? 'hide' : ''}`}>
          <div className="splash-logo-anim">
            <svg width="90" height="104" viewBox="0 0 90 104" fill="none">
              <defs>
                <linearGradient id="hg1" x1="0" y1="0" x2="90" y2="104" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#00d4ff"/>
                  <stop offset="55%" stopColor="#0072ff"/>
                  <stop offset="100%" stopColor="#0040cc"/>
                </linearGradient>
                <linearGradient id="hg2" x1="0" y1="0" x2="60" y2="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.28)"/>
                  <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                </linearGradient>
              </defs>
              <polygon points="45,2 87,25 87,79 45,102 3,79 3,25" fill="url(#hg1)"/>
              <polygon points="45,2 87,25 87,79 45,102 3,79 3,25" fill="url(#hg2)" opacity="0.5"/>
              <path d="M24 68 L24 36 L38 57 L45 46 L52 57 L66 36 L66 68" stroke="#08122a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              <path d="M45 46 L45 68" stroke="#08122a" strokeWidth="7" strokeLinecap="round" fill="none"/>
            </svg>
            <div className="splash-brand">MENTIXORA</div>
            <div className="splash-progress">
              <div className="splash-bar"></div>
            </div>
          </div>
        </div>

        {/* Main landing content */}
        <div className="logo-wrap">
          <svg width="100" height="116" viewBox="0 0 90 104" fill="none">
            <defs>
              <linearGradient id="hg3" x1="0" y1="0" x2="90" y2="104" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00d4ff"/>
                <stop offset="55%" stopColor="#0072ff"/>
                <stop offset="100%" stopColor="#0040cc"/>
              </linearGradient>
              <linearGradient id="hg4" x1="0" y1="0" x2="60" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255,255,255,0.28)"/>
                <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
              </linearGradient>
            </defs>
            <polygon points="45,2 87,25 87,79 45,102 3,79 3,25" fill="url(#hg3)"/>
            <polygon points="45,2 87,25 87,79 45,102 3,79 3,25" fill="url(#hg4)" opacity="0.5"/>
            <path d="M24 68 L24 36 L38 57 L45 46 L52 57 L66 36 L66 68" stroke="#08122a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M45 46 L45 68" stroke="#08122a" strokeWidth="7" strokeLinecap="round" fill="none"/>
          </svg>

          <div className="brand-name">MENTIXORA</div>
          <div className="tagline">Your space to connect beyond limits.</div>
          <div className="divider"></div>

          <div className="btn-row">
            <button className="btn-primary" onClick={() => router.push('/login')}>
              Login
            </button>
            <button className="btn-secondary" onClick={() => router.push('/signup')}>
              Register
            </button>
          </div>
        </div>
      </div>
    </>
  );
}