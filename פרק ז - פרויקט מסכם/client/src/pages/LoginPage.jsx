import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../serves/api';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const res = await api.login({ email, password });
      const { token, name, role, id, department_id } = res.data;

      // שמירה ב־localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({ id, name, role, email, department_id }));

      // מעבר לדף הבית
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בהתחברות');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="row w-100">
        <div className="col-md-6 col-lg-4 mx-auto">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white text-center py-4">
              <h2 className="card-title mb-0">
                <i className="bi bi-shop display-4"></i>
                <div className="mt-2">🛍️ חנות רשת</div>
              </h2>
              <p className="mb-0">התחברות למערכת</p>
            </div>
            
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle"></i> {error}
                </div>
              )}
              
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    <i className="bi bi-envelope"></i> כתובת אימייל
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control form-control-lg"
                    placeholder="הכנס כתובת אימייל"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    <i className="bi bi-lock"></i> סיסמה
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="form-control form-control-lg"
                    placeholder="הכנס סיסמה"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    dir="ltr"
                  />
                </div>
                
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        מתחבר...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right"></i> התחבר
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            <div className="card-footer text-center bg-light">
              <p className="mb-0">
                אין לך חשבון?{' '}
                <a href="/register" className="text-primary fw-bold text-decoration-none">
                  הרשם כאן
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;