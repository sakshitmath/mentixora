'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, getCommunities } from '../lib/api';

export default function CreatePostPage() {
  const router = useRouter();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    flair: '',
    mood: '',
    communityId: '',
    imageUrl: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('mentixora_token');
    if (!token) { router.push('/login'); return; }
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const res = await getCommunities();
      setCommunities(res.data);
    } catch (err) { console.error(err); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.communityId) { setError('Please select a community'); return; }
    if (!formData.mood) { setError('Please select a mood'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await createPost({
        ...formData,
        communityId: parseInt(formData.communityId)
      });
      router.push(`/posts/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const moods = [
    { value: 'HAPPY', label: '😊 Happy', color: '#00e5c8' },
    { value: 'RANT', label: '😤 Rant', color: '#ff6b6b' },
    { value: 'QUESTION', label: '❓ Question', color: '#4B9FD5' },
    { value: 'INSPIRING', label: '✨ Inspiring', color: '#a78bfa' },
    { value: 'DEBATE', label: '🔥 Debate', color: '#f59e0b' },
  ];

  const flairs = ['Discussion', 'Achievement', 'Opinion', 'Guide', 'Rant', 'Tech', 'Career', 'Debate'];

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

        .page-title {
          font-size: 22px; font-weight: 700;
          color: #fff; margin-bottom: 6px;
          letter-spacing: 0.05em;
        }
        .page-sub {
          font-size: 12px; color: #2a4a6a;
          letter-spacing: 0.08em; text-transform: uppercase;
          margin-bottom: 28px;
        }

        .card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(0,180,255,0.12);
          border-radius: 12px;
          padding: 28px;
        }

        .input-group { margin-bottom: 20px; }
        .input-label {
          display: block; font-size: 11px;
          font-weight: 600; letter-spacing: 0.1em;
          color: #4B9FD5; margin-bottom: 8px;
          text-transform: uppercase;
        }
        .input-field {
          width: 100%; padding: 12px 14px;
          background: rgba(0,130,255,0.05);
          border: 1px solid rgba(0,180,255,0.18);
          border-radius: 8px; color: #fff;
          font-family: 'Exo 2', sans-serif;
          font-size: 14px; outline: none;
          transition: border-color 0.2s;
        }
        .input-field:focus {
          border-color: rgba(0,180,255,0.55);
          background: rgba(0,130,255,0.08);
        }
        .input-field::placeholder { color: #1a3a5a; }

        .textarea-field {
          width: 100%; padding: 12px 14px;
          background: rgba(0,130,255,0.05);
          border: 1px solid rgba(0,180,255,0.18);
          border-radius: 8px; color: #fff;
          font-family: 'Exo 2', sans-serif;
          font-size: 14px; outline: none;
          resize: vertical; min-height: 140px;
          transition: border-color 0.2s;
          line-height: 1.6;
        }
        .textarea-field:focus {
          border-color: rgba(0,180,255,0.55);
          background: rgba(0,130,255,0.08);
        }
        .textarea-field::placeholder { color: #1a3a5a; }

        .select-field {
          width: 100%; padding: 12px 14px;
          background: rgba(0,130,255,0.05);
          border: 1px solid rgba(0,180,255,0.18);
          border-radius: 8px; color: #fff;
          font-family: 'Exo 2', sans-serif;
          font-size: 14px; outline: none;
          cursor: pointer;
          appearance: none;
        }
        .select-field option { background: #0d1929; color: #fff; }

        .mood-grid {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .mood-btn {
          padding: 8px 16px; border-radius: 20px;
          border: 1px solid rgba(0,180,255,0.2);
          background: transparent; color: #4B9FD5;
          font-family: 'Exo 2', sans-serif;
          font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.18s;
        }
        .mood-btn.selected {
          transform: scale(1.05);
        }

        .flair-grid {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .flair-btn {
          padding: 7px 14px; border-radius: 20px;
          border: 1px solid rgba(0,180,255,0.2);
          background: transparent; color: #4B9FD5;
          font-family: 'Exo 2', sans-serif;
          font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.18s;
        }
        .flair-btn.selected {
          background: rgba(0,144,255,0.2);
          border-color: rgba(0,180,255,0.6);
          color: #00c6ff;
        }
        .flair-btn:hover {
          background: rgba(0,144,255,0.1);
          border-color: rgba(0,180,255,0.4);
        }

        .error-msg {
          background: rgba(255,60,60,0.1);
          border: 1px solid rgba(255,60,60,0.3);
          border-radius: 8px; padding: 10px 14px;
          color: #ff6b6b; font-size: 13px;
          margin-bottom: 16px; text-align: center;
        }

        .btn-submit {
          width: 100%; padding: 14px;
          border-radius: 8px; border: none;
          background: linear-gradient(135deg, #0090ff, #00c6ff);
          color: #fff; font-family: 'Exo 2', sans-serif;
          font-size: 14px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          cursor: pointer; transition: all 0.18s;
          box-shadow: 0 4px 20px rgba(0,144,255,0.3);
          margin-top: 8px;
        }
        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(0,144,255,0.5);
        }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .divider {
          height: 1px;
          background: rgba(0,180,255,0.08);
          margin: 20px 0;
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
        <div className="page-title">Create Post</div>
        <div className="page-sub">Share something with the community</div>

        <div className="card">
          {error && <div className="error-msg">{error}</div>}

          <form onSubmit={handleSubmit}>

            {/* Community */}
            <div className="input-group">
              <label className="input-label">Community</label>
              <select
                className="select-field"
                name="communityId"
                value={formData.communityId}
                onChange={handleChange}
                required>
                <option value="">Select a community...</option>
                {communities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="input-group">
              <label className="input-label">Title</label>
              <input
                className="input-field"
                type="text"
                name="title"
                placeholder="Write a compelling title..."
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Content */}
            <div className="input-group">
              <label className="input-label">Content</label>
              <textarea
                className="textarea-field"
                name="content"
                placeholder="Share your thoughts, ideas, questions..."
                value={formData.content}
                onChange={handleChange}
                required
              />
            </div>

            <div className="divider"></div>

            {/* Mood — Unique Feature */}
            <div className="input-group">
              <label className="input-label">Mood Tag ✨ (Unique Feature)</label>
              <div className="mood-grid">
                {moods.map(m => (
                  <button
                    key={m.value}
                    type="button"
                    className={`mood-btn ${formData.mood === m.value ? 'selected' : ''}`}
                    style={formData.mood === m.value ? {
                      background: `${m.color}20`,
                      borderColor: m.color,
                      color: m.color
                    } : {}}
                    onClick={() => setFormData({...formData, mood: m.value})}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flair */}
            <div className="input-group">
              <label className="input-label">Post Flair</label>
              <div className="flair-grid">
                {flairs.map(f => (
                  <button
                    key={f}
                    type="button"
                    className={`flair-btn ${formData.flair === f ? 'selected' : ''}`}
                    onClick={() => setFormData({...formData, flair: f})}>
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div className="divider"></div>

            {/* Submit */}
            <button className="btn-submit" type="submit" disabled={loading}>
              {loading ? 'Publishing...' : '🚀 Publish Post'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}