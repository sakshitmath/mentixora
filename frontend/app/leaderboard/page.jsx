'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLeaderboard } from '../lib/api';

export default function LeaderboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('mentixora_token');
    if (!token) { router.push('/login'); return; }
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await getLeaderboard();
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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

  const rankColors = ['#f59e0b', '#9CA3AF', '#CD7F32'];

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

        .page-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .page-title {
          font-size: 28px; font-weight: 700;
          color: #fff; margin-bottom: 6px;
          letter-spacing: 0.08em;
        }
        .page-sub {
          font-size: 12px; color: #2a4a6a;
          letter-spacing: 0.12em; text-transform: uppercase;
        }

        .top3-grid {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 12px;
          margin-bottom: 32px;
        }

        .top3-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(0,180,255,0.12);
          border-radius: 12px;
          padding: 20px 16px;
          text-align: center;
          flex: 1;
          max-width: 180px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .top3-card:hover {
          border-color: rgba(0,180,255,0.35);
          transform: translateY(-3px);
        }
        .top3-card.first {
          border-color: rgba(245,158,11,0.35);
          background: rgba(245,158,11,0.04);
          padding: 28px 16px;
        }

        .rank-badge {
          font-size: 24px; margin-bottom: 8px;
        }
        .avatar-circle {
          width: 52px; height: 52px;
          border-radius: 50%;
          display: flex; align-items: center;
          justify-content: center;
          font-size: 20px; font-weight: 700;
          margin: 0 auto 10px;
          color: #fff;
        }
        .top3-username {
          font-size: 13px; font-weight: 700;
          color: #fff; margin-bottom: 4px;
          letter-spacing: 0.05em;
        }
        .top3-score {
          font-size: 20px; font-weight: 700;
          margin-bottom: 4px;
        }
        .top3-label {
          font-size: 10px; color: #2a4a6a;
          letter-spacing: 0.1em; text-transform: uppercase;
        }
        .level-badge {
          display: inline-block;
          padding: 3px 10px; border-radius: 20px;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.06em;
          margin-top: 6px;
        }

        .section-title {
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.12em; color: #2a4a6a;
          text-transform: uppercase; margin-bottom: 14px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(0,180,255,0.08);
        }

        .user-row {
          display: flex; align-items: center;
          gap: 14px;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(0,180,255,0.08);
          border-radius: 10px;
          padding: 14px 16px;
          margin-bottom: 8px;
          cursor: pointer;
          transition: all 0.18s;
        }
        .user-row:hover {
          border-color: rgba(0,180,255,0.25);
          background: rgba(0,144,255,0.04);
        }
        .rank-num {
          font-size: 16px; font-weight: 700;
          color: #2a4a6a; width: 28px;
          text-align: center; flex-shrink: 0;
        }
        .user-avatar-sm {
          width: 38px; height: 38px;
          border-radius: 50%;
          display: flex; align-items: center;
          justify-content: center;
          font-size: 16px; font-weight: 700;
          color: #fff; flex-shrink: 0;
        }
        .user-info { flex: 1; }
        .user-name {
          font-size: 14px; font-weight: 600;
          color: #e0e0e0; margin-bottom: 3px;
        }
        .user-level {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.06em;
        }
        .user-score {
          text-align: right; flex-shrink: 0;
        }
        .score-num {
          font-size: 18px; font-weight: 700;
          color: #00c6ff;
        }
        .score-label {
          font-size: 10px; color: #2a4a6a;
          letter-spacing: 0.08em; text-transform: uppercase;
        }
        .karma-num {
          font-size: 12px; color: #4B9FD5;
          margin-top: 2px;
        }

        .loading {
          text-align: center; color: #2a4a6a;
          padding: 60px; font-size: 14px;
          letter-spacing: 0.1em;
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
        <div className="page-header">
          <div className="page-title">🏆 Credix Leaderboard</div>
          <div className="page-sub">Top contributors this week</div>
        </div>

        {loading ? (
          <div className="loading">LOADING LEADERBOARD...</div>
        ) : (
          <>
            {/* Top 3 */}
            {users.length >= 3 && (
              <div className="top3-grid">
                {/* 2nd place */}
                <div className="top3-card"
                  onClick={() => router.push(`/profile/${users[1].id}`)}>
                  <div className="rank-badge">🥈</div>
                  <div className="avatar-circle"
                    style={{background: 'linear-gradient(135deg, #4B9FD5, #0072ff)'}}>
                    {users[1].username[0].toUpperCase()}
                  </div>
                  <div className="top3-username">@{users[1].username}</div>
                  <div className="top3-score" style={{color: '#9CA3AF'}}>
                    {users[1].credixScore}
                  </div>
                  <div className="top3-label">Credix Score</div>
                  <div className="level-badge" style={{
                    background: `${levelColors[users[1].contributorLevel]}18`,
                    border: `1px solid ${levelColors[users[1].contributorLevel]}44`,
                    color: levelColors[users[1].contributorLevel]
                  }}>
                    {levelIcons[users[1].contributorLevel]} {users[1].contributorLevel}
                  </div>
                </div>

                {/* 1st place */}
                <div className="top3-card first"
                  onClick={() => router.push(`/profile/${users[0].id}`)}>
                  <div className="rank-badge">🥇</div>
                  <div className="avatar-circle"
                    style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)', width: '64px', height: '64px', fontSize: '24px'}}>
                    {users[0].username[0].toUpperCase()}
                  </div>
                  <div className="top3-username"
                    style={{fontSize: '15px'}}>@{users[0].username}</div>
                  <div className="top3-score" style={{color: '#f59e0b', fontSize: '26px'}}>
                    {users[0].credixScore}
                  </div>
                  <div className="top3-label">Credix Score</div>
                  <div className="level-badge" style={{
                    background: `${levelColors[users[0].contributorLevel]}18`,
                    border: `1px solid ${levelColors[users[0].contributorLevel]}44`,
                    color: levelColors[users[0].contributorLevel]
                  }}>
                    {levelIcons[users[0].contributorLevel]} {users[0].contributorLevel}
                  </div>
                </div>

                {/* 3rd place */}
                <div className="top3-card"
                  onClick={() => router.push(`/profile/${users[2].id}`)}>
                  <div className="rank-badge">🥉</div>
                  <div className="avatar-circle"
                    style={{background: 'linear-gradient(135deg, #CD7F32, #a05a1e)'}}>
                    {users[2].username[0].toUpperCase()}
                  </div>
                  <div className="top3-username">@{users[2].username}</div>
                  <div className="top3-score" style={{color: '#CD7F32'}}>
                    {users[2].credixScore}
                  </div>
                  <div className="top3-label">Credix Score</div>
                  <div className="level-badge" style={{
                    background: `${levelColors[users[2].contributorLevel]}18`,
                    border: `1px solid ${levelColors[users[2].contributorLevel]}44`,
                    color: levelColors[users[2].contributorLevel]
                  }}>
                    {levelIcons[users[2].contributorLevel]} {users[2].contributorLevel}
                  </div>
                </div>
              </div>
            )}

            {/* Rest of users */}
            <div className="section-title">All Contributors</div>
            {users.map((user, index) => (
              <div key={user.id} className="user-row"
                onClick={() => router.push(`/profile/${user.id}`)}>
                <div className="rank-num"
                  style={{color: index < 3 ? rankColors[index] : '#2a4a6a'}}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                </div>
                <div className="user-avatar-sm"
                  style={{background: `linear-gradient(135deg, ${levelColors[user.contributorLevel]}, #0072ff)`}}>
                  {user.username[0].toUpperCase()}
                </div>
                <div className="user-info">
                  <div className="user-name">@{user.username}</div>
                  <div className="user-level"
                    style={{color: levelColors[user.contributorLevel]}}>
                    {levelIcons[user.contributorLevel]} {user.contributorLevel}
                  </div>
                </div>
                <div className="user-score">
                  <div className="score-num">{user.credixScore}</div>
                  <div className="score-label">Credix</div>
                  <div className="karma-num">⚡ {user.karma} karma</div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}