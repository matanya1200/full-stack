import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'

function UserSettingsPage() {
  const navigate = useNavigate()
  const localUser = JSON.parse(localStorage.getItem('user'))
  const [user, setUser] = useState(localUser)
  const [currentPassword, setCurrentPassword] = useState('')
  const [form, setForm] = useState({
    name: localUser?.name || '',
    username: localUser?.username || '',
    email: localUser?.email || '',
    password: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!localUser) navigate('/login')
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpdate = async () => {
    if (!currentPassword) return setMessage('יש להזין את הסיסמה הנוכחית')

    try {
      await api.updateUser(user.id, { ...form, currentPassword })
      const updatedUser = { ...user, ...form }
      delete updatedUser.password
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setMessage('הפרטים עודכנו בהצלחה ✅')
    } catch (err) {
      console.error(err)
      setMessage(err.response?.data?.message || 'שגיאה בעדכון פרטים')
    }
  }

  const handleDelete = async () => {
    const confirm = window.prompt('כדי למחוק את המשתמש, הזן את הסיסמה הנוכחית:')
    if (!confirm) return

    try {
      await api.deleteUser(user.id, { password: confirm })
      localStorage.removeItem('user')
      navigate('/register')
    } catch (err) {
      console.error(err)
      setMessage(err.response?.data?.message || 'שגיאה במחיקת המשתמש')
    }
  }

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container mt-5">
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: '600px' }}>
          <h3 className="mb-4 text-center text-primary">ניהול פרטי משתמש</h3>

          <div className="mb-3">
            <label className="form-label">שם</label>
            <input name="name" className="form-control" value={form.name} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">שם משתמש</label>
            <input name="username" className="form-control" value={form.username} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">אימייל</label>
            <input name="email" className="form-control" value={form.email} onChange={handleChange} />
          </div>

          <div className="mb-3">
            <label className="form-label">סיסמה נוכחית (נדרשת)</label>
            <input type="password" className="form-control" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          </div>

          <div className="mb-4">
            <label className="form-label">סיסמה חדשה</label>
            <input name="password" type="password" className="form-control" value={form.password} onChange={handleChange} />
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn btn-primary" onClick={handleUpdate}>עדכן פרטים</button>
            <button className="btn btn-danger" onClick={handleDelete}>מחק משתמש</button>
          </div>

          {message && (
            <div className="alert alert-info text-center mt-3">{message}</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserSettingsPage
