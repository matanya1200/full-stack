import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

function AddProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [minQty, setMinQty] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [image, setImage] = useState('');
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    api.getDepartments().then((res) => setDepartments(res.data));
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      console.log(reader.result, reader.result.length);
      
      setImage(reader.result); // reader.result is already a base64 string prefixed with "data:image/..."
    };
    reader.readAsDataURL(file); // Converts to base64
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!name || !price || !minQty || !departmentId) {
      setError('❌ יש למלא את כל השדות החיוניים');
      return;
    }

    try {
      await api.createProduct({
        name,
        description,
        price: parseFloat(price),
        quantity: 0,
        min_quantity: parseInt(minQty),
        department_id: parseInt(departmentId),
        image: image,
      });

      setMessage('✅ המוצר נוסף בהצלחה');
      setTimeout(() => navigate('/'), 1000);
    } catch {
      setError('❌ שגיאה בהוספת המוצר');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="card shadow-sm p-4">
          <h2 className="mb-4 text-primary">
            <i className="bi bi-box-seam"></i> הוספת מוצר חדש
          </h2>

          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">שם</label>
              <input
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">תיאור</label>
              <textarea
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">מחיר</label>
              <input
                type="number"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">כמות מינימלית</label>
              <input
                type="number"
                className="form-control"
                value={minQty}
                onChange={(e) => setMinQty(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">מחלקה</label>
              <select
                className="form-select"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                required
              >
                <option value="">-- בחר מחלקה --</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">תמונה</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <button type="submit" className="btn btn-success">
              <i className="bi bi-plus-circle"></i> הוסף מוצר
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddProductPage;
