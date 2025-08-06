import { useEffect, useState } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

function RestockPage() {
  const [restocks, setRestocks] = useState([]);
  const [filteredRestocks, setFilteredRestocks] = useState([]);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadRestocks();
  }, []);

  useEffect(() => {
    filterByStatus();
  }, [statusFilter, restocks]);

  const loadRestocks = async () => {
    try {
      const res = await api.getRestockList();
      setRestocks(res.data);
    } catch {
      setError('שגיאה בטעינת רשימת ההזמנות');
    }
  };

  const filterByStatus = () => {
    if (statusFilter === 'all') {
      setFilteredRestocks(restocks);
    } else {
      setFilteredRestocks(restocks.filter((r) => r.status === statusFilter));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="badge bg-warning text-dark">בהמתנה</span>;
      case 'ordered':
        return <span className="badge bg-primary">הוזמן</span>;
      case 'arrived':
        return <span className="badge bg-success">הגיע</span>;
      case 'rejected':
        return <span className="badge bg-danger">נדחה</span>;
      default:
        return <span className="badge bg-secondary">לא ידוע</span>;
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2><i className="bi bi-clipboard-data"></i> רשימת הזמנות מלאי</h2>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* סינון לפי סטטוס */}
        <div className="mb-3">
          <label className="form-label">סינון לפי סטטוס:</label>
          <select
            className="form-select w-auto d-inline-block ms-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">הצג הכל</option>
            <option value="pending">בהמתנה</option>
            <option value="ordered">הוזמן</option>
            <option value="arrived">הגיע</option>
            <option value="rejected">נדחה</option>
          </select>
        </div>

        {filteredRestocks.length === 0 ? (
          <div className="alert alert-info text-center">לא נמצאו הזמנות תואמות</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-striped shadow-sm">
              <thead className="table-dark">
                <tr>
                  <th>מזהה</th>
                  <th>מוצר</th>
                  <th>כמות</th>
                  <th>סטטוס</th>
                  <th>תאריך</th>
                </tr>
              </thead>
              <tbody>
                {filteredRestocks.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.product_name}</td>
                    <td>{r.quantity}</td>
                    <td>{getStatusBadge(r.status)}</td>
                    <td>{new Date(r.requested_at).toLocaleString('he-IL')}</td>
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

export default RestockPage;
