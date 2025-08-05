import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import './DepartmentsPage.css';

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadDepartments = async () => {
    try {
      const res = await api.getDepartments();
      setDepartments(res.data);
    } catch {
      setError('❌ שגיאה בטעינת מחלקות');
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleAdd = async () => {
    const name = prompt('הזן שם למחלקה החדשה:');
    if (!name || name.trim() === '') return;

    try {
      await api.addDepartment({ name: name.trim() });
      setMessage('✅ מחלקה נוספה בהצלחה');
      setError('');
      loadDepartments();
    } catch {
      setMessage('');
      setError('❌ שגיאה בהוספת מחלקה');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
            <div className="departments-header">
              <h2 className="departments-title">
                <i className="bi bi-building"></i> מחלקות
              </h2>
              <button className="btn btn-success" onClick={handleAdd}>
                <i className="bi bi-plus-circle"></i> הוסף מחלקה
              </button>
            </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        {departments.length === 0 ? (
          <div className="alert alert-info">לא נמצאו מחלקות</div>
        ) : (
          <ul className="list-group">
            {departments.map((d) => (
              <li key={d.id} className="list-group-item d-flex justify-content-between align-items-center">
                <strong>{d.name}</strong>
                <span className="badge bg-secondary">ID: {d.id}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default DepartmentsPage;
