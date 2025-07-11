import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../serves/api';
import Navbar from '../components/Navbar';

function EditProductPage() {
  const { product_id } = useParams();
  const productId = parseInt(product_id);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    min_quantity: '',
    image_url: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProduct = async () => {
    try {
      const res = await api.getProduct(productId);
      setProduct(res.data);
      setForm({
        name: res.data.name,
        description: res.data.description,
        price: res.data.discounted_price,
        min_quantity: res.data.min_quantity,
        image_url: res.data.image_url
      });
    } catch {
      setError('❌ שגיאה בטעינת המוצר');
    }
  };

  useEffect(() => {
    if (!productId) {
      setError('מזהה מוצר חסר');
      return;
    }
    loadProduct();
  }, [productId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await api.updateProduct(productId, form);
      setSuccess('✅ המוצר עודכן בהצלחה');
      setError('');
    } catch (err) {
      setError('❌ שגיאה בעדכון המוצר');
      setSuccess('');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="card shadow mx-auto" style={{ maxWidth: '600px' }}>
          <div className="card-header bg-warning text-dark">
            <h4 className="mb-0"><i className="bi bi-pencil-square"></i> עריכת מוצר</h4>
          </div>
          <div className="card-body">
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            {product ? (
              <form>
                <div className="mb-3">
                  <label className="form-label">שם:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">תיאור:</label>
                  <textarea
                    className="form-control"
                    name="description"
                    rows="3"
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">מחיר:</label>
                  <input
                    type="number"
                    className="form-control"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">כמות מינימלית:</label>
                  <input
                    type="number"
                    className="form-control"
                    name="min_quantity"
                    value={form.min_quantity}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">כתובת תמונה:</label>
                  <input
                    type="text"
                    className="form-control"
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                  />
                </div>

                <div className="d-grid">
                  <button type="button" onClick={handleUpdate} className="btn btn-primary">
                    <i className="bi bi-save"></i> שמור שינויים
                  </button>
                </div>
              </form>
            ) : (
              <p>טוען פרטי מוצר...</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProductPage;
