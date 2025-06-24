import { useNavigate, useLocation } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const navItems = [
    { path: '/', label: 'דף הבית', icon: 'bi-house-door' },
    { path: '/todos', label: 'משימות', icon: 'bi-check2-square' },
    { path: '/posts', label: 'פוסטים', icon: 'bi-journal-text' },
    { path: '/albums', label: 'אלבומים', icon: 'bi-images' }
  ]

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm sticky-top">
      <div className="container-fluid">
        {/* Brand */}
        <a className="navbar-brand fw-bold" href="#" onClick={(e) => {e.preventDefault(); navigate('/')}}>
          <i className="bi bi-app me-2"></i>
          המערכת שלי
        </a>

        {/* Toggle button for mobile */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation items */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {navItems.map((item) => (
              <li className="nav-item" key={item.path}>
                <button 
                  className={`nav-link btn btn-link text-white border-0 ${isActive(item.path) ? 'active fw-bold' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <i className={`${item.icon} me-1`}></i>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* User info and logout */}
          <div className="navbar-nav">
            <div className="nav-item dropdown">
              <button 
                className="nav-link dropdown-toggle btn btn-link text-white border-0 d-flex align-items-center" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-2" style={{ fontSize: '1.2rem' }}></i>
                <span className="d-none d-md-inline">{user.name || user.username || 'משתמש'}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <h6 className="dropdown-header">
                    <i className="bi bi-person-fill me-2"></i>
                    {user.name || user.username}
                  </h6>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item"
                    onClick={() => navigate('/info')}
                  >
                    <i className="bi bi-person-lines-fill me-2"></i>
                    מידע אישי
                  </button>
                </li>
                <li>
                  <button 
                    className="dropdown-item"
                    onClick={() => navigate('/users')}
                  >
                    <i className="bi bi-gear me-2"></i>
                    הגדרות
                  </button>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button 
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    התנתק
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar