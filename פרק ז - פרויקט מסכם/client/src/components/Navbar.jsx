
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import socketService from '../services/socketService';
import { useAuth } from '../auth/AuthContext';
import './Navbar.css';

function Navbar() {
  //const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { isLoading, isAuthenticated, isAdmin, isStoreKeeper, isWorker, user, logout: authLogout } = useAuth();

  const logout = () => {
    authLogout();
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          🛍️ חנות רשת
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarNav"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav me-auto">
            {!isLoading && isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/cart">
                    <i className="bi bi-cart"></i> העגלה שלי
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/payment">
                    <i className="bi bi-credit-card"></i> תשלום
                  </Link>
                </li>
                {!isAdmin &&
                  <li className="nav-item">
                    <Link className="nav-link" to="/orders">
                      <i className="bi bi-box-seam"></i> הזמנות שלי
                    </Link>
                  </li>
                }
              </>
            )}
            {!isLoading && isAdmin &&
              <>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="stockDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-box"></i> הזמנות
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/orders">
                        <i className="bi bi-hourglass-split"></i> הזמנות שלי
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/allOrders">
                        <i className="bi bi-hourglass-split"></i> הזמנות של כולם
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            }
            {/* עובדים ומנהלים */}
            {!isLoading && (isAdmin || isStoreKeeper || isWorker) && (
              <>
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" id="stockDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i className="bi bi-box"></i> מלאי
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/pendingRestock">
                        <i className="bi bi-hourglass-split"></i> הזמנות מוצרים לחנות
                      </Link>
                    </li>
                    {(isAdmin || isStoreKeeper) && (
                      <li>
                        <Link className="dropdown-item" to="/Restock">
                          <i className="bi bi-list-check"></i> כל ההזמנות מלאי
                        </Link>
                      </li>
                    )}
                  </ul>
                </li>
              </>
            )}

            {/* מנהל בלבד */}
            {!isLoading && isAdmin && (
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="adminDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i className="bi bi-gear"></i> ניהול
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/users">
                      <i className="bi bi-people"></i> ניהול משתמשים
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/department">
                      <i className="bi bi-building"></i> מחלקות
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/carts">
                      <i className="bi bi-cart3"></i> כל העגלות
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/allLogs">
                      <i className="bi bi-journal-text"></i> כל הלוגים
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/adminDashboard">
                      <i className="bi bi-speedometer2"></i> מעקב מכירות
                    </Link>
                  </li>
                </ul>
              </li>
            )}
          </ul>

          {/* User Info & Logout */}
          {!isLoading && isAuthenticated && (
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <span className="badge bg-light text-dark ms-1">{user?.role}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li className="dropdown-item">
                    <i className="bi bi-person-circle"></i> {user?.name}
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/user">
                      <i className="bi bi-person"></i> פרופיל
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/log">
                      <i className="bi bi-clock-history"></i> היסטוריה
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={logout}>
                      <i className="bi bi-box-arrow-right"></i> התנתקות
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;