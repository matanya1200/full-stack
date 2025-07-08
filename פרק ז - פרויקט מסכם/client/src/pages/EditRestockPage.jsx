import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../serves/api';
import Navbar from '../components/Navbar';

function EditRestockPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const restockId = location.state?.restockId;

  const [restock, setRestock] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadRestock = async () => {
      try {
        const res = await api.getRestockList();
        const found = res.data.find((r) => r.id === restockId);
        if (!found) {
          setError('❌ ההזמנה לא נמצאה');
        } else {
          setRestock(found);
          setQuantity(found.quantity);
          setStatus(found.status);
        }
      } catch {
        setError('❌ שגיאה בטעינת ההזמנה');
      }
    };

    if (restockId) loadRestock();
    else setError('❌ חסר מזהה להזמנה');
  }, [restockId]);

  const handleUpdate = async () => {
    if (quantity <= 0) return setError('⚠️ הכמות חייבת להיות חיובית');

    try {
      await api.updateRestock(restockId, { quantity, status });
      setSuccess('✅ ההזמנה עודכנה בהצלחה');
      setTimeout(() => navigate('/pendingRestock'), 1000);
    } catch {
      setError('❌ שגיאה בעדכון ההזמנה');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-primary mb-4">
          <i className="bi bi-pencil-square"></i> עריכת הזמנת מלאי
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {restock && (
          <div className="card shadow-sm p-4">
            <p><strong>מזהה:</strong> {restock.id}</p>
            <p><strong>מוצר:</strong> {restock.product_name}</p>

            <div className="mb-3">
              <label className="form-label">כמות:</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">סטטוס:</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="ordered">Ordered</option>
              </select>
            </div>

            <button className="btn btn-success" onClick={handleUpdate}>
              💾 שמור שינויים
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default EditRestockPage;
