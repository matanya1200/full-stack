import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const res = await api.getAllUsers();
      setUsers(res.data);
    } catch {
      setError('❌ שגיאה בטעינת המשתמשים');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const goToEdit = (user) => {
    navigate('/editUser', { state: { user } });
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-primary">
          <i className="bi bi-people-fill"></i> ניהול משתמשים
        </h2>
        <hr />

        {error && <div className="alert alert-danger">{error}</div>}

        {users.length === 0 ? (
          <div className="alert alert-info">לא נמצאו משתמשים</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle text-center">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>שם</th>
                  <th>אימייל</th>
                  <th>תפקיד</th>
                  <th>מחלקה</th>
                  <th>סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr 
                    key={u.id} 
                    onClick={() => goToEdit(u)} 
                    style={{ cursor: 'pointer' }}
                    className="table-row"
                  >
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge bg-${u.role === 'admin' ? 'danger' : u.role === 'worker' ? 'primary' : u.role === 'storekeeper' ? 'warning text-dark' : 'secondary'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.department_id || '–'}</td>
                    <td>
                      {u.is_blocked ? (
                        <span className="badge bg-danger">🚫 חסום</span>
                      ) : (
                        <span className="badge bg-success">✅ פעיל</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default UsersPage;
