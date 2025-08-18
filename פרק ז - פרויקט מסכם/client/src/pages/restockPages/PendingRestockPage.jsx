import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

function PendingRestockPage() {
  const [restocks, setRestocks] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const loadPending = async () => {
    try {
      const res = await api.getPendingRestocks();
      setRestocks(res.data.data);
    } catch {
      setError('שגיאה בטעינת ההזמנות');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('האם למחוק את ההזמנה?')) return;
    try {
      await api.deleteRestock(id);
      loadPending();
    } catch {
      alert('❌ שגיאה במחיקת ההזמנה');
    }
  };

  useEffect(() => {
    loadPending();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2><i className="bi bi-hourglass-split"></i> הזמנות במצב Pending</h2>
          <button className="btn btn-success" onClick={() => navigate('/addRestock')}>
            <i className="bi bi-plus-circle"></i> הוספת הזמנה
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {restocks.length === 0 ? (
          <div className="alert alert-info text-center">
            לא קיימות הזמנות ממתינות
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>מזהה</th>
                  <th>מוצר</th>
                  <th>כמות</th>
                  <th>תאריך</th>
                  <th>סטטוס</th>
                  {user.role === 'storekeeper' && (
                  <th>פעולות</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {restocks.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.product_name}</td>
                    <td>{r.quantity}</td>
                    <td>{new Date(r.requested_at).toLocaleString('he-IL')}</td>
                    <td>
                      <span className="badge bg-warning text-dark">{r.status}</span>
                    </td>
                    {user.role === 'storekeeper' && (
                      <td>
                        <button
                          className="btn btn-outline-primary btn-sm me-2 ms-2"
                          onClick={() => navigate('/editRestock', { state: { restockId: r.id } })}
                        >
                          ✏️ עריכה
                        </button>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(r.id)}
                        >
                          🗑️ מחיקה
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default PendingRestockPage;
