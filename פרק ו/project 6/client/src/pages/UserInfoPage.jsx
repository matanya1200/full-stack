import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'

function UserInfoPage() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [info, setInfo] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    api.getUserById(user.id)
      .then(response => setInfo(response.data))
      .catch(error => console.error(error))
  }, [])

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      <div className="container mt-5">
        <div className="card shadow p-4 mx-auto" style={{ maxWidth: '500px' }}>
          <h3 className="mb-4 text-center text-primary">פרטי המשתמש</h3>
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><strong>שם:</strong> {user.name}</li>
            <li className="list-group-item"><strong>שם משתמש:</strong> {user.username}</li>
            <li className="list-group-item"><strong>אימייל:</strong> {user.email}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default UserInfoPage
