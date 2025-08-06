
import { useEffect, useState } from 'react';
import api from '../../services/api';
import Navbar from '../../components/Navbar';

function AllLogsPage() {
  const [logs, setLogs] = useState([]);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [error, setError] = useState('');

  const loadLogs = async () => {
    try {
      const res = userIdFilter
        ? await api.getLogsByUser(userIdFilter)
        : await api.getAllLogs();
      setLogs(res.data);
      setError('');
    } catch {
      setError('❌ שגיאה בטעינת לוגים');
    }
  };

  useEffect(() => {
    loadLogs();
  }, [userIdFilter]);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="page-title">
          <i className="bi bi-journal-text"></i> לוגים של כל המשתמשים
        </h2>

        <div className="mb-4 w-50">
          <label className="form-label">סינון לפי מזהה משתמש:</label>
          <input
            type="number"
            className="form-control"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
            placeholder="לדוגמה: 3"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {logs.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle"></i> לא נמצאו לוגים
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>מזהה משתמש</th>
                  <th>פעולה</th>
                  <th>תאריך</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td>{log.user_id || userIdFilter}</td>
                    <td>{log.activity}</td>
                    <td>{new Date(log.date).toLocaleString('he-IL')}</td>
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

export default AllLogsPage;
