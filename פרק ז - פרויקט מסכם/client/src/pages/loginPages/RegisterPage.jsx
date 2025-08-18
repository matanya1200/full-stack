
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../auth/AuthContext';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await api.register(form);
      const { token, name, role, id, email } = res.data;

      await login(token);
      localStorage.setItem('user', JSON.stringify({ token, id, name, role, email }));

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה ברישום');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-bg">
      <div className="row w-100">
        <div className="col-md-6 col-lg-5 mx-auto">
          <div className="card register-card">
            <div className="card-header register-header">
              <h2 className="card-title register-title mb-0">
                <i className="bi bi-person-plus display-4"></i>
                <div className="mt-2">🛍️ חנות רשת</div>
              </h2>
              <p className="mb-0">הרשמה למערכת</p>
            </div>
            
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle"></i> {error}
                </div>
              )}
              
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    <i className="bi bi-person"></i> שם מלא
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-control form-control-lg"
                    placeholder="הכנס שם מלא"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="bi bi-envelope"></i> כתובת אימייל
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="form-control form-control-lg"
                    placeholder="הכנס כתובת אימייל"
                    value={form.email}
                    onChange={handleChange}
                    required
                    dir="ltr"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    <i className="bi bi-lock"></i> סיסמה
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="form-control form-control-lg"
                    placeholder="הכנס סיסמה"
                    value={form.password}
                    onChange={handleChange}
                    required
                    dir="ltr"
                  />
                  <div className="form-text">
                    <i className="bi bi-info-circle"></i> הסיסמה צריכה להכיל לפחות 6 תווים
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="address" className="form-label">
                    <i className="bi bi-geo-alt"></i> כתובת מגורים
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-control form-control-lg"
                    placeholder="הכנס כתובת מגורים"
                    value={form.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-success btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        נרשם...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus"></i> הרשם
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="card-footer text-center bg-light">
              <p className="mb-0">
                כבר יש לך חשבון?{' '}
                <a href="/login" className="text-success fw-bold text-decoration-none">
                  התחבר כאן
                </a>
              </p>
            </div>
          </div>
          
          {/* Registration Benefits */}
          <div className="card mt-3 border-success">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0">
                <i className="bi bi-check-circle"></i> יתרונות הרישום
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6">
                  <i className="bi bi-cart text-success"></i> עגלת קניות<br />
                  <i className="bi bi-star text-warning"></i> דירוג מוצרים
                </div>
                <div className="col-6">
                  <i className="bi bi-clock-history text-info"></i> היסטוריית הזמנות<br />
                  <i className="bi bi-person-check text-primary"></i> פרופיל אישי
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;