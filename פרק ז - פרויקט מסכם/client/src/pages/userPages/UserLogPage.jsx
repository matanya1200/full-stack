import { useEffect, useState } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import './UserLogPage.css';

function UserLogPage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');

  const loadLogs = async () => {
    try {
      const res = await api.getLogsByUser(user.id);
      setLogs(res.data.reverse()); // סידור מהחדש לישן
    } catch (err) {
      setError('שגיאה בטעינת הלוג');
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const getActivityIcon = (activity) => {
    if (activity.includes('Order placed')) return 'bi-cart-check';
    if (activity.includes('הזמנה')) return 'bi-box';
    if (activity.includes('תשלום')) return 'bi-credit-card';
    if (activity.includes('עדכון')) return 'bi-pencil-square';
    if (activity.includes('מחיקה')) return 'bi-trash';
    return 'bi-activity';
  };

  const getTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `לפני ${diffDays} ימים`;
    if (diffHours > 0) return `לפני ${diffHours} שעות`;
    return 'לפני זמן קצר';
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-10 mx-auto">
            <div className="card shadow-sm">
              <div className="card-header bg-info text-white">
                <h2 className="mb-0">
                  <i className="bi bi-journal-text me-2"></i>
                  לוג הפעילות שלי
                </h2>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}
                
                {logs.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-journal display-1 text-muted"></i>
                    <p className="text-muted fs-5 mt-3">לא נמצאו פעולות</p>
                  </div>
                ) : (
                  <div className="timeline">
                    {logs.map((log, i) => (
                      <div key={i} className="timeline-item mb-3">
                        <div className="card border-start border-4 border-primary">
                          <div className="card-body">
                            <div className="row align-items-center">
                              <div className="col-auto">
                                <div className="bg-primary wh-40 text-white rounded-circle d-flex align-items-center justify-content-center">
                                  <i className={`bi ${getActivityIcon(log.activity)}`}></i>
                                </div>
                              </div>
                              <div className="col">
                                <div className="d-flex justify-content-between align-items-start">
                                  <div>
                                    <p className="mb-1 fw-bold">{log.activity}</p>
                                    <small className="text-muted">
                                      <i className="bi bi-clock me-1"></i>
                                      {new Date(log.date).toLocaleString('he-IL')}
                                    </small>
                                  </div>
                                  <span className="badge bg-light text-dark">
                                    {getTimeAgo(log.date)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserLogPage;