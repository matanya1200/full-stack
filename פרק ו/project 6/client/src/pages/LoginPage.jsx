import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await axios.post('http://localhost:3000/login', { username, password })
      const user = {
        id: data.id,
        username: data.username,
        email: data.email,
        name: data.name,
      }
      localStorage.setItem('user', JSON.stringify(user))
      onLogin(user)
      navigate('/')
    } catch (err) {
      setError('שם משתמש או סיסמה לא נכונים')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <i className="bi bi-person-circle text-primary" style={{ fontSize: '3rem' }}></i>
                  <h2 className="card-title mt-3 mb-1 fw-bold">התחברות</h2>
                  <p className="text-muted">ברוך הבא חזרה!</p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{error}</div>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">שם משתמש</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person"></i>
                      </span>
                      <input 
                        type="text" 
                        className="form-control" 
                        id="username"
                        placeholder="הכנס שם משתמש" 
                        value={username} 
                        onChange={e => setUsername(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">סיסמה</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input 
                        type="password" 
                        className="form-control" 
                        id="password"
                        placeholder="הכנס סיסמה" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-2 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        מתחבר...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        התחבר
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="text-center mb-3">
                  <span className="text-muted">או</span>
                </div>

                {/* Register Button */}
                <button 
                  className="btn btn-outline-secondary w-100"
                  onClick={() => navigate('/register')}
                  disabled={loading}
                >
                  <i className="bi bi-person-plus me-2"></i>
                  צור חשבון חדש
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <small className="text-muted">
                © 2024 המערכת שלך. כל הזכויות שמורות.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage