import { useEffect, useState } from 'react';
import './Notification.css';

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
    <div className="notification">
      {message}
    </div>
  );
}