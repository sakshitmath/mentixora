'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getPost, getComments, addComment, vote, react, getReactions } from '../../lib/api';

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [reactions, setReactions] = useState({});
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const reactionEmojis = ['💡','❤️','🔥','🚀','😂','👏'];
  const reactionTypes = ['HELPFUL','RELATABLE','INTERESTING','INSPIRATIONAL','FUNNY','APPRECIATED'];
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
    const u = localStorage.getItem('mentixora_user');
    if (u) setUser(JSON.parse(u));
    fetchAll();
  }, [id]);

  const fetchAll = async () => {
    try {
      const [postRes, commentsRes, reactionsRes] = await Promise.all([
        getPost(id),
        getComments(id),
        getReactions(id)
      ]);
      setPost(postRes.data);
      setComments(commentsRes.data);
      setReactions(reactionsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (voteType) => {
    try {
      await vote({ postId: parseInt(id), voteType });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handleReact = async (reactionType) => {
    try {
      await react({ postId: parseInt(id), reactionType });
      fetchAll();
    } catch (err) { console.error(err); }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await addComment({ content: commentText, postId: parseInt(id) });
      setCommentText('');
      fetchAll();
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div style={{color:'#2a4a6a', background:'#080f1f', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Exo 2, sans-serif', letterSpacing:'0.1em'}}>
      LOADING...
    </div>
  );

  if (!post) return (
    <div style={{color:'#ff6b6b', background:'#080f1f', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
      Post not found.
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
          cursor: pointer; letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .back-btn:hover { background: rgba(0,144,255,0.12); }

        .page-wrap {
          max-width: 720px;
          margin: 0 auto;
          padding: 80px 16px 40px;
        }

        .post-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(0,180,255,0.15);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
        }

        .post-meta {
          display: flex; align-items: center;
          gap: 8px; margin-bottom: 12px; flex-wrap: wrap;
        }
        .post-author { font-size: 13px; font-weight: 600; color: #00c6ff; }
        .post-community { font-size: 12px; color: #2a4a6a; }
        .post-time { font-size: 11px; color: #1a3a5a; margin-left: auto; }

        .post-flair {
          display: inline-block; padding: 2px 10px;
          border-radius: 20px; font-size: 11px; font-weight: 600;
          background: rgba(0,144,255,0.12);
          border: 1px solid rgba(0,144,255,0.25);
          color: #4B9FD5; margin-bottom: 10px;
        }
        .post-mood {
          display: inline-block; padding: 2px 10px;
          border-radius: 20px; font-size: 11px;
          font-weight: 600; margin-left: 6px; margin-bottom: 10px;
        }
        .post-title {
          font-size: 20px; font-weight: 700;
          color: #fff; margin-bottom: 12px; line-height: 1.4;
        }
        .post-content {
          font-size: 14px; color: #7A9ABF;
          line-height: 1.7; margin-bottom: 20px;
        }

        .actions-row {
          display: flex; gap: 8px;
          flex-wrap: wrap; margin-bottom: 16px;
        }
        .vote-btn {
          display: flex; align-items: center; gap: 4px;
          padding: 7px 14px; border-radius: 6px;
          border: 1px solid rgba(0,180,255,0.2);
          background: transparent; color: #4B9FD5;
          font-family: 'Exo 2', sans-serif;
          font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.18s;
        }
        .vote-btn:hover { background: rgba(0,144,255,0.12); }
        .vote-up:hover { color: #00e5c8; border-color: #00e5c8; }
        .vote-down:hover { color: #ff6b6b; border-color: #ff6b6b; }

        .reactions-row {
          display: flex; gap: 8px;
          flex-wrap: wrap; margin-bottom: 8px;
        }
        .reaction-btn {
          display: flex; align-items: center; gap: 4px;
          padding: 6px 12px; border-radius: 20px;
          border: 1px solid rgba(0,180,255,0.15);
          background: rgba(0,130,255,0.05);
          font-size: 14px; cursor: pointer;
          transition: all 0.18s; color: #4B9FD5;
          font-family: 'Exo 2', sans-serif; font-size: 12px;
        }
        .reaction-btn:hover {
          background: rgba(0,144,255,0.15);
          transform: scale(1.05);
          border-color: rgba(0,180,255,0.4);
        }
        .reaction-count { font-weight: 600; color: #00c6ff; }

        .section-title {
          font-size: 13px; font-weight: 700;
          letter-spacing: 0.12em; color: #2a4a6a;
          text-transform: uppercase; margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(0,180,255,0.08);
        }

        .comment-form { margin-bottom: 24px; }
        .comment-input {
          width: 100%; padding: 12px 14px;
          background: rgba(0,130,255,0.05);
          border: 1px solid rgba(0,180,255,0.2);
          border-radius: 8px; color: #fff;
          font-family: 'Exo 2', sans-serif;
          font-size: 13px; outline: none;
          resize: vertical; min-height: 80px;
          transition: border-color 0.2s;
          margin-bottom: 10px;
        }
        .comment-input:focus { border-color: rgba(0,180,255,0.6); }
        .comment-input::placeholder { color: #1a3a5a; }
        .comment-submit {
          padding: 9px 24px; border-radius: 6px;
          border: none;
          background: linear-gradient(135deg, #0090ff, #00c6ff);
          color: #fff; font-family: 'Exo 2', sans-serif;
          font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          cursor: pointer; transition: all 0.18s;
        }
        .comment-submit:hover { transform: translateY(-1px); }

        .comment-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(0,180,255,0.08);
          border-radius: 8px; padding: 14px 16px;
          margin-bottom: 10px;
        }
        .comment-meta {
          display: flex; align-items: center;
          gap: 8px; margin-bottom: 8px;
        }
        .comment-author { font-size: 12px; font-weight: 600; color: #00c6ff; }
        .comment-time { font-size: 11px; color: #1a3a5a; margin-left: auto; }
        .comment-content { font-size: 13px; color: #7A9ABF; line-height: 1.6; }

        .contributor-badge {
          font-size: 10px; padding: 2px 8px;
          border-radius: 10px;
          background: rgba(0,229,200,0.1);
          border: 1px solid rgba(0,229,200,0.3);
          color: #00e5c8; font-weight: 600;
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
        {/* Post */}
        <div className="post-card">
          <div className="post-meta">
            <span className="post-author">@{post.author?.username}</span>
            {post.author?.contributorLevel !== 'NEWCOMER' && (
              <span className="contributor-badge">{post.author?.contributorLevel}</span>
            )}
            <span className="post-community">in {post.community?.name}</span>
            <span className="post-time">{new Date(post.createdAt).toLocaleDateString()}</span>
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

          <div className="post-title">{post.title}</div>
          <div className="post-content">{post.content}</div>

          {/* Votes */}
          <div className="actions-row">
            <button className="vote-btn vote-up" onClick={() => handleVote('UPVOTE')}>
              ▲ {post.upvotes} Upvotes
            </button>
            <button className="vote-btn vote-down" onClick={() => handleVote('DOWNVOTE')}>
              ▼ {post.downvotes} Downvotes
            </button>
          </div>

          {/* Reactions */}
          <div className="reactions-row">
            {reactionEmojis.map((emoji, i) => (
              <button key={i} className="reaction-btn"
                onClick={() => handleReact(reactionTypes[i])}
                title={reactionTypes[i]}>
                {emoji}
                {reactions[reactionTypes[i]] && (
                  <span className="reaction-count">{reactions[reactionTypes[i]]}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Comments */}
        <div className="section-title">
          💬 {comments.length} Comments
        </div>

        {/* Add Comment */}
        <div className="comment-form">
          <textarea
            className="comment-input"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button className="comment-submit" onClick={handleComment}>
            Post Comment
          </button>
        </div>

        {/* Comments list */}
        {comments.map(comment => (
          <div key={comment.id} className="comment-card">
            <div className="comment-meta">
              <span className="comment-author">@{comment.author?.username}</span>
              {comment.author?.contributorLevel !== 'NEWCOMER' && (
                <span className="contributor-badge">{comment.author?.contributorLevel}</span>
              )}
              <span className="comment-time">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="comment-content">{comment.content}</div>
          </div>
        ))}

        {comments.length === 0 && (
          <div style={{color:'#1a3a5a', textAlign:'center', padding:'30px', fontSize:'13px'}}>
            No comments yet. Be the first!
          </div>
        )}
      </div>
    </>
  );
}