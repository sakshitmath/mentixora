'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUserCredix } from '../../lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const levelColors = {
    MENTOR: '#f59e0b',
    CONTRIBUTOR: '#a78bfa',
    ACTIVE: '#00e5c8',
    NEWCOMER: '#4B9FD5'
  };

  const levelIcons = {
    MENTOR: '🌟',
    CONTRIBUTOR: '🏅',
    ACTIVE: '🚀',
    NEWCOMER: '⭐'
  };

  useEffect(() => {
    const token = localStorage.getItem('mentixora_token');
    if (!token) { router.push('/login'); return; }
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const res = await getUserCredix(id);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{color:'#2a4a6a', background:'#080f1f', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Exo 2,sans-serif', letterSpacing:'0.1em'}}>
      LOADING...
    </div>
  );

  if (!profile) return (
    <div style={{color:'#ff6b6b', background:'#080f1f', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      User not found.
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700&family=Rajdhani:wght@300;400;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080f1f; font-family: 'Exo 2', sans-serif; }

        .navbar {
          position: fixed; top: 0; left: 0; right: 0;
          height: 56px;
          background: rgba(8,15,31,0.95);
          border-bottom: 1px solid rgba(0,180,255,0.12);
          display: flex; align-items: center;
          padding: 0 24px; z-index: 100;
          backdrop-filter: blur(10px);
          justify-content: space-between;
        }
        .nav-left { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .nav-brand { font-size: 18px; font-weight: 700; letter-spacing: 0.15em; color: #fff; }
        .back-btn {
          padding: 7px 16px; border-radius: 6px;
          border: 1px solid rgba(0,180,255,0.3);
          background: transparent; color: #4B9FD5;
          font-family: 'Exo 2', sans-serif;
          font-size: 12px; font-weight: 600;
          cursor: pointer; text-transform: uppercase;
        }
        .back-btn:hover { background: rgba(0,144,255,0.12); }

        .page-wrap {
          max-width: 680px;
          margin: 0 auto;
          padding: 80px 16px 40px;
        }

        .profile-header {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(0,180,255,0.12);
          border-radius: 16px;
          padding: 32px;
          text-align: center;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }

        .profile-bg-glow {
          position: absolute;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(ellipse, rgba(0,180,255,0.06) 0%, transparent 70%);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .avatar-large {
          width: 80px; height: 80px;
          border-radius: 50%;
          display: flex; align-items: center;
          justify-content: center;
          font-size: 32px; font-weight: 700;
          color: #fff;
          margin: 0 auto 16px;
          position: relative; z-index: 1;
        }

        .profile-username {
          font-size: 22px; font-weight: 700;
          color: #fff; letter-spacing: 0.08em;
          margin-bottom: 6px;
        }

        .profile-level {
          display: inline-block;
          padding: 5px 16px; border-radius: 20px;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em;
          margin-bottom: 16px;
        }

        .profile-bio {
          font-size: 13px; color: #4B6A8A;
          line-height: 1.6; margin-bottom: 20px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px; letter-spacing: 0.03em;
        }

        .stats-row {
          display: flex; gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .stat-box {
          text-align: center;
          padding: 14px 20px;
          background: rgba(0,130,255,0.05);
          border: 1px solid rgba(0,180,255,0.12);
          border-radius: 10px;
          min-width: 100px;
        }

        .stat-num {
          font-size: 24px; font-weight: 700;
          color: #00c6ff; margin-bottom: 4px;
        }

        .stat-label {
          font-size: 10px; color: #2a4a6a;
          letter-spacing: 0.1em; text-transform: uppercase;
        }

        .section-title {
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.12em; color: #2a4a6a;
          text-transform: uppercase; margin-bottom: 14px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(0,180,255,0.08);
        }

        .badges-grid {
          display: flex; gap: 10px; flex-wrap: wrap;
          margin-bottom: 24px;
        }

        .badge-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(0,180,255,0.12);
          border-radius: 10px;
          padding: 14px 18px;
          text-align: center;
          min-width: 110px;
          transition: all 0.2s;
        }

        .badge-card:hover {
          border-color: rgba(0,180,255,0.35);
          transform: translateY(-2px);
        }

        .badge-icon { font-size: 28px; margin-bottom: 6px; }
        .badge-name {
          font-size: 11px; font-weight: 600;
          color: #4B9FD5; letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .no-badges {
          color: #1a3a5a; font-size: 13px;
          padding: 20px; text-align: center;
        }

        .credix-bar-wrap {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(0,180,255,0.12);
          border-radius: 12px;
          padding: 20px 24px;
          margin-bottom: 20px;
        }

        .bar-label {
          display: flex; justify-content: space-between;
          margin-bottom: 10px;
        }
        .bar-title {
          font-size: 12px; font-weight: 600;
          color: #4B9FD5; letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .bar-value {
          font-size: 12px; color: #00c6ff; font-weight: 600;
        }

        .progress-track {
          height: 6px;
          background: rgba(0,180,255,0.08);
          border-radius: 3px; overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #0090ff, #00e5c8);
          border-radius: 3px;
          transition: width 1s ease;
        }

        .next-level {
          font-size: 11px; color: #1a3a5a;
          margin-top: 8px; text-align: right;
        }
          @media (max-width: 768px) {
  .page-wrap { padding: 68px 12px 40px; }
  .stats-row { gap: 10px; }
  .stat-box { min-width: 80px; padding: 12px 14px; }
  .badges-grid { gap: 8px; }
  .badge-card { min-width: 90px; padding: 12px 14px; }
}
      `}</style>

      {/* Navbar */}
      <div className="navbar">
        <div className="nav-left" onClick={() => router.push('/feed')}>
          <svg width="28" height="32" viewBox="0 0 90 104" fill="none">
            <defs>
              <linearGradient id="nl" x1="0" y1="0" x2="90" y2="104" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00d4ff"/>
                <stop offset="100%" stopColor="#0040cc"/>
              </linearGradient>
            </defs>
            <polygon points="45,2 87,25 87,79 45,102 3,79 3,25" fill="url(#nl)"/>
            <path d="M24 68 L24 36 L38 57 L45 46 L52 57 L66 36 L66 68" stroke="#08122a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M45 46 L45 68" stroke="#08122a" strokeWidth="7" strokeLinecap="round" fill="none"/>
          </svg>
          <span className="nav-brand">MENTIXORA</span>
        </div>
        <button className="back-btn" onClick={() => router.back()}>← Back</button>
      </div>

      <div className="page-wrap">

        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-bg-glow"></div>
          <div className="avatar-large"
            style={{background: `linear-gradient(135deg, ${levelColors[profile.contributorLevel]}, #0072ff)`}}>
            {profile.username[0].toUpperCase()}
          </div>
          <div className="profile-username">@{profile.username}</div>
          <div className="profile-level" style={{
            background: `${levelColors[profile.contributorLevel]}18`,
            border: `1px solid ${levelColors[profile.contributorLevel]}44`,
            color: levelColors[profile.contributorLevel]
          }}>
            {levelIcons[profile.contributorLevel]} {profile.contributorLevel}
          </div>

          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-num">{profile.credixScore}</div>
              <div className="stat-label">Credix Score</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">{profile.karma}</div>
              <div className="stat-label">Karma</div>
            </div>
            <div className="stat-box">
              <div className="stat-num">{profile.badges?.length || 0}</div>
              <div className="stat-label">Badges</div>
            </div>
          </div>
        </div>

        {/* Credix Progress Bar */}
        <div className="credix-bar-wrap">
          <div className="bar-label">
            <span className="bar-title">Credix Progress</span>
            <span className="bar-value">{profile.credixScore} pts</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill"
              style={{width: `${Math.min((profile.credixScore / 500) * 100, 100)}%`}}>
            </div>
          </div>
          <div className="next-level">
            {profile.credixScore < 50 ? `${50 - profile.credixScore} pts to ACTIVE` :
             profile.credixScore < 200 ? `${200 - profile.credixScore} pts to CONTRIBUTOR` :
             profile.credixScore < 500 ? `${500 - profile.credixScore} pts to MENTOR` :
             '🌟 Max Level Reached!'}
          </div>
        </div>

        {/* User Info Card */}
        <div className="credix-bar-wrap" style={{marginBottom: '20px'}}>
          <div className="section-title" style={{marginBottom: '14px'}}>👤 About</div>
          <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(0,180,255,0.06)'}}>
              <span style={{fontSize:'12px', color:'#2a4a6a', letterSpacing:'0.08em', textTransform:'uppercase'}}>Username</span>
              <span style={{fontSize:'13px', color:'#00c6ff', fontWeight:'600'}}>@{profile.username}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(0,180,255,0.06)'}}>
              <span style={{fontSize:'12px', color:'#2a4a6a', letterSpacing:'0.08em', textTransform:'uppercase'}}>Email</span>
              <span style={{fontSize:'13px', color:'#4B9FD5', fontWeight:'600'}}>{profile.email || 'Private'}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(0,180,255,0.06)'}}>
              <span style={{fontSize:'12px', color:'#2a4a6a', letterSpacing:'0.08em', textTransform:'uppercase'}}>Level</span>
              <span style={{fontSize:'13px', fontWeight:'700', color: levelColors[profile.contributorLevel]}}>
                {levelIcons[profile.contributorLevel]} {profile.contributorLevel}
              </span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0'}}>
              <span style={{fontSize:'12px', color:'#2a4a6a', letterSpacing:'0.08em', textTransform:'uppercase'}}>Member Since</span>
              <span style={{fontSize:'13px', color:'#4B9FD5', fontWeight:'600'}}>
                {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', {year:'numeric', month:'long'}) : 'Mentixora Member'}
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="section-title">🏅 Badges Earned</div>
        {profile.badges && profile.badges.length > 0 ? (
          <div className="badges-grid">
            {profile.badges.map((badge, i) => (
              <div key={i} className="badge-card">
                <div className="badge-icon">{badge.badgeIcon}</div>
                <div className="badge-name">{badge.badgeName}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-badges">
            No badges yet. Keep contributing to earn badges!
          </div>
        )}

      </div>
    </>
  );
}