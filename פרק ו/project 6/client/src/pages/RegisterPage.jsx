import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function RegisterPage() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await axios.post('http://localhost:3000/register', { name, username, email, password })
      setSuccess('החשבון נוצר בהצלחה! מעביר לדף התחברות...')
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError('שגיאה ברישום - ייתכן שהמשתמש כבר קיים')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow-lg border-0">
              <div className="card-body p-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <i className="bi bi-person-plus-fill text-success" style={{ fontSize: '3rem' }}></i>
                  <h2 className="card-title mt-3 mb-1 fw-bold">רישום</h2>
                  <p className="text-muted">צור חשבון חדש במערכת</p>
                </div>

                {/* Success Alert */}
                {success && (
                  <div className="alert alert-success d-flex align-items-center" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <div>{success}</div>
                  </div>
                )}

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <div>{error}</div>
                  </div>
                )}

                {/* Register Form */}
                <form onSubmit={handleRegister}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">שם מלא</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-person-fill"></i>
                        </span>
                        <input 
                          type="text" 
                          className="form-control" 
                          id="name"
                          placeholder="הכנס שם מלא" 
                          value={name} 
                          onChange={e => setName(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="username" className="form-label">שם משתמש</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-at"></i>
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
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">כתובת אימייל</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input 
                        type="email" 
                        className="form-control" 
                        id="email"
                        placeholder="הכנס כתובת אימייל" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">סיסמה</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-shield-lock"></i>
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
                        minLength="6"
                      />
                    </div>
                    <div className="form-text">
                      <i className="bi bi-info-circle me-1"></i>
                      הסיסמה חייבת להכיל לפחות 6 תווים
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-success w-100 py-2 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        יוצר חשבון...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-lg me-2"></i>
                        צור חשבון
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="text-center mb-3">
                  <span className="text-muted">כבר יש לך חשבון?</span>
                </div>

                {/* Login Button */}
                <button 
                  className="btn btn-outline-primary w-100"
                  onClick={() => navigate('/login')}
                  disabled={loading}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  התחבר לחשבון קיים
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

export default RegisterPage