import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import './EditUserPage.css';

function EditUserPage() {
  const location = useLocation();
  const user = location.state?.user;

  const [role, setRole] = useState(user?.role || '');
  const [departmentId, setDepartmentId] = useState(user?.department_id || '');
  const [isBlocked, setIsBlocked] = useState(user?.is_blocked || false);
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getDepartments().then((res) => setDepartments(res.data));
  }, []);

  const handleRoleUpdate = async () => {
    try {
      await api.updateUserRole(user.id, { role, department_id: departmentId || null });
      setMessage('🎉 תפקיד עודכן בהצלחה');
    } catch {
      setMessage('❌ שגיאה בעדכון התפקיד');
    }
  };

  const handleBlockToggle = async () => {
    try {
      await api.blockUser(user.id, { block: !isBlocked });
      setIsBlocked(!isBlocked);
      setMessage(!isBlocked ? '🚫 המשתמש נחסם' : '✅ המשתמש שוחרר');
    } catch {
      setMessage('❌ שגיאה בחסימה/שחרור');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="edit-user-title"><i className="bi bi-person-gear"></i> עריכת משתמש</h2>
        <hr />

        {message && (
          <div className="alert alert-info">{message}</div>
        )}

        <div className="mb-3">
          <label className="form-label fw-bold">שם:</label>
          <p className="form-control-plaintext">{user.name}</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">אימייל:</label>
          <p className="form-control-plaintext">{user.email}</p>
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">תפקיד:</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={user.role === 'admin'}
          >
            <option value="admin">מנהל</option>
            <option value="customer">לקוח</option>
            <option value="worker">עובד</option>
            <option value="storekeeper">מחסנאי</option>
          </select>
        </div>

        {role === 'worker' && (
          <div className="mb-3">
            <label className="form-label fw-bold">מחלקה:</label>
            <select
              className="form-select"
              value={departmentId || ''}
              onChange={(e) => setDepartmentId(parseInt(e.target.value))}
            >
              <option value="">-- ללא --</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          className="btn btn-primary me-2"
          onClick={handleRoleUpdate}
          disabled={user.role === 'admin'}
        >
          <i className="bi bi-save"></i> עדכון תפקיד
        </button>

        <hr />

        <div className="mb-3">
          <label className="form-label fw-bold">מצב משתמש:</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              checked={!isBlocked}
              onChange={handleBlockToggle}
            />
            <label className="form-check-label">פעיל</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              checked={isBlocked}
              onChange={handleBlockToggle}
            />
            <label className="form-check-label text-danger">חסום</label>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditUserPage;
