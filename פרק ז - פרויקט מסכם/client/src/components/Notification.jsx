import { useEffect, useState } from 'react';

export default function Notification() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('notification');
    if (stored) {
      setMessage(stored);
      sessionStorage.removeItem('notification');
      const timer = setTimeout(() => setMessage(null), 4000); // 4 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      left: 24,
      background: '#333',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: '8px',
      zIndex: 9999,
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
    }}>
      {message}
    </div>
  );
}