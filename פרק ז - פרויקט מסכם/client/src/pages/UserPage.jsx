import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import './UserPage.css';

function UserPage() {
  const localUser = JSON.parse(localStorage.getItem('user'));
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadUser = async () => {
    try {
      const res = await api.getUser(localUser.id);
      setUser(res.data);
      setName(res.data.name);
      setAddress(res.data.address);
    } catch {
      setError('שגיאה בטעינת המשתמש');
    }
  };

  const handleUpdate = async () => {
    try {
      await api.updateUser(localUser.id, { name, address });
      setSuccess('הפרטים עודכנו בהצלחה');
      setError('');

      // עדכון localStorage
      const updated = { ...localUser, name };
      localStorage.setItem('user', JSON.stringify(updated));
      
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('שגיאה בעדכון המשתמש');
      setSuccess('');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את המשתמש?')) return;
    try {
        await api.deleteUser(localUser.id);
        alert('המשתמש נמחק');
        localStorage.removeItem('user');
        window.location.href = '/login';
    } catch {
        setError('שגיאה במחיקת המשתמש');
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h2 className="mb-0">
                  <i className="bi bi-person-circle me-2 ms-2"></i>
                  פרטי המשתמש
                </h2>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="alert alert-success" role="alert">
                    <i className="bi bi-check-circle me-2"></i>
                    {success}
                  </div>
                )}

                {user ? (
                  <div className="row">
                    <div className="col-md-4 text-center mb-4">
                      <div className="bg-light wh-120 rounded-circle d-inline-flex align-items-center justify-content-center">
                        <i className="bi bi-person-fill display-3 text-muted"></i>
                      </div>
                      <h5 className="mt-3">{user.name}</h5>
                      <p className="text-muted">{user.email}</p>
                    </div>
                    <div className="col-md-8">
                      <form>
                        <div className="mb-3">
                          <label className="form-label">
                            <i className="bi bi-envelope me-2 ms-1"></i>
                            אימייל
                          </label>
                          <label 
                            type="email" 
                            className="form-control" 
                            readOnly 
                          >{user.email} </label>
                          <div className="form-text">לא ניתן לשנות את כתובת האימייל</div>
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label">
                            <i className="bi bi-person me-2"></i>
                            שם מלא
                          </label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            placeholder="הכנס שם מלא"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label className="form-label">
                            <i className="bi bi-geo-alt me-2"></i>
                            כתובת
                          </label>
                          <textarea 
                            className="form-control" 
                            rows="3"
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="הכנס כתובת מלאה"
                          />
                        </div>
                        
                        <div className="d-flex gap-2">
                          <button 
                            type="button" 
                            className="btn btn-success" 
                            onClick={handleUpdate}
                          >
                            <i className="bi bi-check-circle me-2"></i>
                            שמור שינויים
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-danger" 
                            onClick={handleDelete}
                          >
                            <i className="bi bi-trash me-2"></i>
                            מחיקת משתמש
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">טוען...</span>
                    </div>
                    <p className="mt-3 text-muted">טוען פרטים...</p>
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

export default UserPage;