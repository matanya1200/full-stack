import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../serves/api';
import Navbar from '../components/Navbar';

function AddRestockPage() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      setSelectedProductId(id); // מזהה מוצר מה-URL
    }
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.getAllProductsWithoutPage();
      setProducts(res.data);
    } catch {
      setError('❌ שגיאה בטעינת מוצרים');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedProductId || quantity <= 0) {
      return setError('אנא בחר מוצר והזן כמות תקינה');
    }

    try {
      await api.addRestock({
        product_id: selectedProductId,
        quantity,
      });
      setSuccess('✅ הזמנה נשלחה בהצלחה');
      setTimeout(() => navigate('/pendingRestock'), 1500);
    } catch {
      setError('❌ שגיאה בשליחת ההזמנה');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2><i className="bi bi-box-seam"></i> הוספת הזמנת מלאי</h2>

        {error && <div className="alert alert-danger mt-3">{error}</div>}
        {success && <div className="alert alert-success mt-3">{success}</div>}

        <form onSubmit={handleSubmit} className="mt-4 shadow-sm p-4 bg-light rounded">
          <div className="mb-3">
            <label htmlFor="productSelect" className="form-label">בחר מוצר להזמנה:</label>
            <select
              id="productSelect"
              className="form-select"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              required
            >
              <option value="">-- בחר מוצר --</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="quantityInput" className="form-label">כמות להזמנה:</label>
            <input
              id="quantityInput"
              type="number"
              className="form-control"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            📦 בצע הזמנה
          </button>
        </form>
      </div>
    </>
  );
}

export default AddRestockPage;
