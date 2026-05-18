'use client';
import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const colors = {
    success: { bg: 'rgba(0,229,200,0.1)', border: 'rgba(0,229,200,0.4)', color: '#00e5c8' },
    error: { bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.4)', color: '#ff6b6b' },
    info: { bg: 'rgba(0,144,255,0.1)', border: 'rgba(0,144,255,0.4)', color: '#00c6ff' },
  };

  const c = colors[type];

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: '10px',
      padding: '12px 20px',
      color: c.color,
      fontFamily: 'Exo 2, sans-serif',
      fontSize: '13px',
      fontWeight: '600',
      letterSpacing: '0.06em',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(10px)',
      maxWidth: '300px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}>
      {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
      {message}
    </div>
  );
}