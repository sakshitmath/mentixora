'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCommunity, getPostsByCommunity, vote } from '../../lib/api';

export default function CommunityPage() {
  const router = useRouter();
  const { slug } = useParams();
  const [community, setCommunity] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const moodColors = {
    HAPPY:'#00e5c8', RANT:'#ff6b6b',
    QUESTION:'#4B9FD5', INSPIRING:'#a78bfa', DEBATE:'#f59e0b'
  };
  const moodEmojis = {
    HAPPY:'😊', RANT:'😤', QUESTION:'❓', INSPIRING:'✨', DEBATE:'🔥'
  };

  useEffect(() => {
    const token = localStorage.getItem('mentixora_token');
    if (!token) { router.push('/login'); return; }
    fetchAll();
  }, [slug]);

  const fetchAll = async () => {
    try {
      const communityRes = await getCommunity(slug);
      setCommunity(communityRes.data);
      const postsRes = await getPostsByCommunity(communityRes.data.id);
      setPosts(postsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (postId, voteType) => {
    try {
      await vote({ postId, voteType });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div style={{color:'#2a4a6a', background:'#080f1f', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Exo 2,sans-serif', letterSpacing:'0.1em'}}>
      LOADING...
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
          max-width: 720px;
          margin: 0 auto;
          padding: 80px 16px 40px;
        }

        .community-header {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(0,180,255,0.15);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 24px;
          position: relative;
          overflow: hidden;
        }

        .community-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(0,144,255,0.04) 0%, transparent 60%);
          pointer-events: none;
        }

        .community-name {
          font-size: 24px; font-weight: 700;
          color: #fff; margin-bottom: 8px;
          letter-spacing: 0.05em;
          position: relative; z-index: 1;
        }

        .community-desc {
          font-size: 14px; color: #4B6A8A;
          line-height: 1.6; margin-bottom: 16px;
          font-family: 'Rajdhani', sans-serif;
          font-size: 15px;
          position: relative; z-index: 1;
        }

        .community-stats {
          display: flex; gap: 20px; flex-wrap: wrap;
          position: relative; z-index: 1;
        }

        .community-stat {
          display: flex; align-items: center; gap: 6px;
        }

        .stat-val {
          font-size: 16px; font-weight: 700; color: #00c6ff;
        }

        .stat-lbl {
          font-size: 11px; color: #2a4a6a;
          letter-spacing: 0.08em; text-transform: uppercase;
        }

        .post-btn {
          padding: 9px 22px; border-radius: 8px;
          border: none;
          background: linear-gradient(135deg, #0090ff, #00c6ff);
          color: #fff; font-family: 'Exo 2', sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; transition: all 0.18s;
          margin-top: 16px;
          position: relative; z-index: 1;
        }
        .post-btn:hover { transform: translateY(-2px); }

        .section-title {
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.12em; color: #2a4a6a;
          text-transform: uppercase; margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(0,180,255,0.08);
        }

        .post-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(0,180,255,0.1);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 12px;
          transition: all 0.2s;
          cursor: pointer;
        }
        .post-card:hover {
          border-color: rgba(0,180,255,0.3);
          transform: translateY(-1px);
        }

        .post-meta {
          display: flex; align-items: center;
          gap: 8px; margin-bottom: 10px; flex-wrap: wrap;
        }
        .post-author { font-size: 13px; font-weight: 600; color: #00c6ff; }
        .post-time { font-size: 11px; color: #1a3a5a; margin-left: auto; }

        .post-flair {
          display: inline-block; padding: 2px 10px;
          border-radius: 20px; font-size: 11px; font-weight: 600;
          background: rgba(0,144,255,0.12);
          border: 1px solid rgba(0,144,255,0.25);
          color: #4B9FD5; margin-bottom: 8px;
        }
        .post-mood {
          display: inline-block; padding: 2px 10px;
          border-radius: 20px; font-size: 11px;
          font-weight: 600; margin-left: 6px; margin-bottom: 8px;
        }

        .post-title {
          font-size: 16px; font-weight: 600;
          color: #e0e0e0; margin-bottom: 8px; line-height: 1.4;
        }
        .post-content {
          font-size: 13px; color: #4B6A8A;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 14px;
        }

        .post-actions {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .vote-btn {
          display: flex; align-items: center; gap: 4px;
          padding: 6px 12px; border-radius: 6px;
          border: 1px solid rgba(0,180,255,0.2);
          background: transparent; color: #4B9FD5;
          font-family: 'Exo 2', sans-serif;
          font-size: 12px; font-weight: 600;
          cursor: pointer; transition: all 0.18s;
        }
        .vote-btn:hover { background: rgba(0,144,255,0.12); }
        .vote-up:hover { color: #00e5c8; border-color: #00e5c8; }
        .vote-down:hover { color: #ff6b6b; border-color: #ff6b6b; }

        .empty {
          text-align: center; color: #2a4a6a;
          padding: 40px; font-size: 13px;
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

        {/* Community Header */}
        {community && (
          <div className="community-header">
            <div className="community-bg"></div>
            <div className="community-name">
              {community.name}
            </div>
            <div className="community-desc">
              {community.description}
            </div>
            <div className="community-stats">
              <div className="community-stat">
                <span className="stat-val">{community.memberCount}</span>
                <span className="stat-lbl">Members</span>
              </div>
              <div className="community-stat">
                <span className="stat-val">{posts.length}</span>
                <span className="stat-lbl">Posts</span>
              </div>
              <div className="community-stat">
                <span className="stat-val">
                  {new Date(community.createdAt).toLocaleDateString('en-IN', {year:'numeric', month:'short'})}
                </span>
                <span className="stat-lbl">Created</span>
              </div>
            </div>
            <button className="post-btn"
              onClick={() => router.push('/create-post')}>
              + Create Post
            </button>
          </div>
        )}

        {/* Posts */}
        <div className="section-title">
          📝 {posts.length} Posts in this community
        </div>

        {posts.length === 0 ? (
          <div className="empty">
            No posts yet in this community. Be the first to post!
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-meta">
                <span className="post-author">@{post.author?.username}</span>
                <span className="post-time">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              {post.flair && <span className="post-flair">{post.flair}</span>}
              {post.mood && (
                <span className="post-mood" style={{
                  background: `${moodColors[post.mood]}18`,
                  border: `1px solid ${moodColors[post.mood]}44`,
                  color: moodColors[post.mood]
                }}>
                  {moodEmojis[post.mood]} {post.mood}
                </span>
              )}

              <div className="post-title"
                onClick={() => router.push(`/posts/${post.id}`)}>
                {post.title}
              </div>
              <div className="post-content">{post.content}</div>

              <div className="post-actions">
                <button className="vote-btn vote-up"
                  onClick={() => handleVote(post.id, 'UPVOTE')}>
                  ▲ {post.upvotes}
                </button>
                <button className="vote-btn vote-down"
                  onClick={() => handleVote(post.id, 'DOWNVOTE')}>
                  ▼ {post.downvotes}
                </button>
                <button className="vote-btn"
                  onClick={() => router.push(`/posts/${post.id}`)}>
                  💬 Comment
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}