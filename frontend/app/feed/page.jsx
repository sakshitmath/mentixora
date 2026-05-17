'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPosts, getTrendingPosts, getPostsByMood, vote, react } from '../lib/api';

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('latest');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('mentixora_token');
    if (!token) { router.push('/login'); return; }
    const u = localStorage.getItem('mentixora_user');
    if (u) setUser(JSON.parse(u));
    fetchPosts('latest');
  }, []);

  const fetchPosts = async (filter) => {
    setLoading(true);
    try {
      let res;
      if (filter === 'trending') res = await getTrendingPosts();
      else if (['HAPPY','RANT','QUESTION','INSPIRING','DEBATE'].includes(filter)) res = await getPostsByMood(filter);
      else res = await getPosts();
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    fetchPosts(filter);
  };

  const handleVote = async (postId, voteType) => {
    try {
      await vote({ postId, voteType });
      fetchPosts(activeFilter);
    } catch (err) { console.error(err); }
  };

  const handleReact = async (postId, reactionType) => {
    try {
      await react({ postId, reactionType });
      fetchPosts(activeFilter);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    localStorage.removeItem('mentixora_token');
    localStorage.removeItem('mentixora_user');
    router.push('/');
  };

  const moodColors = {
    HAPPY: '#00e5c8', RANT: '#ff6b6b',
    QUESTION: '#4B9FD5', INSPIRING: '#a78bfa',
    DEBATE: '#f59e0b'
  };

  const moodEmojis = {
    HAPPY: '😊', RANT: '😤', QUESTION: '❓',
    INSPIRING: '✨', DEBATE: '🔥'
  };

  const reactions = ['💡','❤️','🔥','🚀','😂','👏'];
  const reactionTypes = ['HELPFUL','RELATABLE','INTERESTING','INSPIRATIONAL','FUNNY','APPRECIATED'];

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
          padding: 0 24px;
          z-index: 100;
          backdrop-filter: blur(10px);
          justify-content: space-between;
        }
        .nav-left { display: flex; align-items: center; gap: 10px; cursor: pointer; }
        .nav-brand {
          font-size: 18px; font-weight: 700;
          letter-spacing: 0.15em; color: #fff;
          text-shadow: 0 0 20px rgba(0,180,255,0.3);
        }
        .nav-right { display: flex; align-items: center; gap: 12px; }
        .nav-btn {
          padding: 7px 18px;
          border-radius: 6px;
          border: none;
          font-family: 'Exo 2', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.08em;
          cursor: pointer;
          text-transform: uppercase;
        }
        .nav-btn-primary {
          background: linear-gradient(135deg, #0090ff, #00c6ff);
          color: #fff;
        }
        .nav-btn-ghost {
          background: transparent;
          border: 1px solid rgba(0,180,255,0.3);
          color: #4B9FD5;
        }
        .nav-username {
          font-size: 13px; color: #00e5c8;
          font-weight: 600; letter-spacing: 0.05em;
        }

        .page-wrap {
          max-width: 720px;
          margin: 0 auto;
          padding: 80px 16px 40px;
        }

        .filters {
          display: flex; gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .filter-btn {
          padding: 7px 16px;
          border-radius: 20px;
          border: 1px solid rgba(0,180,255,0.2);
          background: transparent;
          color: #4B9FD5;
          font-family: 'Exo 2', sans-serif;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.06em;
          cursor: pointer;
          transition: all 0.18s;
          text-transform: uppercase;
        }
        .filter-btn:hover, .filter-btn.active {
          background: rgba(0,144,255,0.15);
          border-color: rgba(0,180,255,0.6);
          color: #00c6ff;
        }

        .post-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(0,180,255,0.1);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 14px;
          transition: border-color 0.2s, transform 0.2s;
          cursor: pointer;
        }
        .post-card:hover {
          border-color: rgba(0,180,255,0.3);
          transform: translateY(-1px);
        }

        .post-meta {
          display: flex; align-items: center;
          gap: 8px; margin-bottom: 10px;
          flex-wrap: wrap;
        }
        .post-author {
          font-size: 13px; font-weight: 600;
          color: #00c6ff;
        }
        .post-community {
          font-size: 12px; color: #2a4a6a;
        }
        .post-time {
          font-size: 11px; color: #1a3a5a;
          margin-left: auto;
        }

        .post-flair {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          background: rgba(0,144,255,0.12);
          border: 1px solid rgba(0,144,255,0.25);
          color: #4B9FD5;
          margin-bottom: 8px;
        }

        .post-mood {
          display: inline-block;
          padding: 2px 10px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          margin-left: 6px;
          margin-bottom: 8px;
        }

        .post-title {
          font-size: 16px; font-weight: 600;
          color: #e0e0e0; margin-bottom: 8px;
          line-height: 1.4;
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
          display: flex; align-items: center;
          gap: 8px; flex-wrap: wrap;
        }
        .vote-btn {
          display: flex; align-items: center; gap: 4px;
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid rgba(0,180,255,0.2);
          background: transparent;
          color: #4B9FD5;
          font-family: 'Exo 2', sans-serif;
          font-size: 12px; font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
        }
        .vote-btn:hover {
          background: rgba(0,144,255,0.12);
          border-color: rgba(0,180,255,0.5);
          color: #00c6ff;
        }
        .vote-up:hover { color: #00e5c8; border-color: #00e5c8; }
        .vote-down:hover { color: #ff6b6b; border-color: #ff6b6b; }

        .reaction-btn {
          padding: 5px 10px;
          border-radius: 6px;
          border: 1px solid rgba(0,180,255,0.15);
          background: transparent;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.18s;
        }
        .reaction-btn:hover {
          background: rgba(0,144,255,0.1);
          transform: scale(1.15);
        }

        .loading {
          text-align: center;
          color: #2a4a6a;
          padding: 60px;
          font-size: 14px;
          letter-spacing: 0.1em;
        }

        .empty {
          text-align: center;
          color: #2a4a6a;
          padding: 60px;
          font-size: 14px;
        }

        .contributor-badge {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 10px;
          background: rgba(0,229,200,0.1);
          border: 1px solid rgba(0,229,200,0.3);
          color: #00e5c8;
          font-weight: 600;
          letter-spacing: 0.05em;
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
        <div className="nav-right">
          {user && <span className="nav-username">@{user.username}</span>}
          <button className="nav-btn nav-btn-ghost" onClick={() => router.push('/community/java-developers')}>
  Communities
</button>
          <button className="nav-btn nav-btn-primary" onClick={() => router.push('/create-post')}>
            + Post
          </button>
          <button className="nav-btn nav-btn-ghost" onClick={() => router.push('/leaderboard')}>
            Credix
          </button>
          <button className="nav-btn nav-btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="page-wrap">

        {/* Filters */}
        <div className="filters">
          {['latest','trending','HAPPY','RANT','QUESTION','INSPIRING','DEBATE'].map(f => (
            <button
              key={f}
              className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
              onClick={() => handleFilter(f)}
            >
              {f === 'latest' ? '🕐 Latest' :
               f === 'trending' ? '🔥 Trending' :
               `${moodEmojis[f]} ${f}`}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="loading">LOADING POSTS...</div>
        ) : posts.length === 0 ? (
          <div className="empty">No posts found. Be the first to post!</div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">

              {/* Meta */}
              <div className="post-meta">
                <span className="post-author">@{post.author?.username}</span>
                {post.author?.contributorLevel !== 'NEWCOMER' && (
                  <span className="contributor-badge">{post.author?.contributorLevel}</span>
                )}
                <span className="post-community">in {post.community?.name}</span>
                <span className="post-time">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Flair + Mood */}
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

              {/* Title + Content */}
              <div className="post-title"
                onClick={() => router.push(`/posts/${post.id}`)}>
                {post.title}
              </div>
              <div className="post-content">{post.content}</div>

              {/* Actions */}
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
                {reactions.map((emoji, i) => (
                  <button key={i} className="reaction-btn"
                    onClick={() => handleReact(post.id, reactionTypes[i])}
                    title={reactionTypes[i]}>
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}