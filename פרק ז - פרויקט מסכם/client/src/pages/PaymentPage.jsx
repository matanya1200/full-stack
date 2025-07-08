import { useEffect, useState } from 'react';
import api from '../serves/api';
import Navbar from '../components/Navbar';

function PaymentPage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [payment, setPayment] = useState(null);
  const [balance, setBalance] = useState('');
  const [expiry, setExpiry] = useState('');
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  const loadPayment = async () => {
    try {
      const res = await api.getPayment(user.id);
      setPayment(res.data);
      setBalance(res.data.balance);
      setExpiry(res.data.card_expiry?.slice(0, 10));
      setCreating(false);
    } catch (err) {
      if (err.response?.status === 404) {
        setCreating(true);
      } else {
        setError('שגיאה בטעינת אמצעי תשלום');
      }
    }
  };

  const handleCreate = async () => {
    const last4 = prompt("הכנס 4 ספרות אחרונות של הכרטיס:");
    const exp = prompt("הכנס תוקף (yyyy-mm-dd):");
    const bal = prompt("הכנס יתרה התחלתית:");

    if (!last4 || !exp || !bal) return;

    try {
      await api.createPayment({
        card_last4: last4,
        card_expiry: exp,
        balance: parseFloat(bal)
      });
      loadPayment();
    } catch (err) {
      setError('שגיאה ביצירת אמצעי תשלום');
    }
  };

  const handleUpdate = async () => {
    try {
      await api.updatePayment(user.id, {
        card_expiry: expiry,
        balance: parseFloat(balance)
      });
      alert('עודכן בהצלחה');
    } catch {
      setError('שגיאה בעדכון אמצעי תשלום');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('למחוק את אמצעי התשלום?')) return;
    try {
        await api.deletePayment(user.id);
        setPayment(null);
        setCreating(true);
    } catch {
        setError('שגיאה במחיקה');
    }
  };

  useEffect(() => {
    loadPayment();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-success text-white">
                <h2 className="mb-0">
                  <i className="bi bi-credit-card me-2"></i>
                  אמצעי תשלום
                </h2>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}

                {creating ? (
                  <div className="text-center py-5">
                    <i className="bi bi-credit-card-2-front display-1 text-muted"></i>
                    <h5 className="mt-3 mb-4">אין אמצעי תשלום פעיל</h5>
                    <button 
                      className="btn btn-primary btn-lg" 
                      onClick={handleCreate}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      צור אמצעי תשלום
                    </button>
                  </div>
                ) : (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h5 className="card-title">
                            <i className="bi bi-credit-card me-2"></i>
                            פרטי כרטיס
                          </h5>
                          <div className="mb-3">
                            <label className="form-label">4 ספרות אחרונות</label>
                            <div className="input-group">
                              <span className="input-group-text">****</span>
                              <input 
                                type="text" 
                                className="form-control" 
                                value={payment?.card_last4} 
                                readOnly 
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">תוקף</label>
                            <input
                              type="date"
                              className="form-control"
                              value={expiry}
                              onChange={(e) => setExpiry(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h5 className="card-title">
                            <i className="bi bi-wallet me-2"></i>
                            יתרה
                          </h5>
                          <div className="mb-3">
                            <label className="form-label">יתרה נוכחית</label>
                            <div className="input-group">
                              <span className="input-group-text">₪</span>
                              <input
                                type="number"
                                className="form-control"
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 d-flex gap-2">
                  {!creating && (
                    <button 
                      className="btn btn-success" 
                      onClick={handleUpdate}
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      עדכן
                    </button>
                  )}
                  <button 
                    className="btn btn-danger" 
                    onClick={handleDelete}
                  >
                    <i className="bi bi-trash me-2"></i>
                    מחיקת אמצעי תשלום
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentPage;