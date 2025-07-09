import { useEffect, useState } from 'react';
import api from '../serves/api';
import Navbar from '../components/Navbar';

function CartsPage() {
  const [cartItems, setCartItems] = useState([]);
  const [userIdFilter, setUserIdFilter] = useState('');
  const [error, setError] = useState('');

  const loadCarts = async () => {
    try {
      setError('');
      if (userIdFilter) {
        const res = await api.getCartByUser(userIdFilter);
        setCartItems(res.data);
      } else {
        const res = await api.getAllCarts();
        setCartItems(res.data);
      }
    } catch {
      setError('❌ שגיאה בטעינת העגלות');
    }
  };

  useEffect(() => {
    loadCarts();
  }, [userIdFilter]);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4 text-primary">
          <i className="bi bi-cart4"></i> כל העגלות
        </h2>

        <div className="mb-4">
          <label className="form-label">סינון לפי מזהה משתמש:</label>
          <input
            type="number"
            className="form-control w-25"
            value={userIdFilter}
            onChange={(e) => setUserIdFilter(e.target.value)}
            placeholder="User ID"
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {cartItems.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle"></i> לא נמצאו פריטים בעגלות
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>מזהה משתמש</th>
                  <th>מזהה מוצר</th>
                  <th>כמות</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.id || index + 1}</td>
                    <td>{item.user_id || userIdFilter}</td>
                    <td>{item.product_id}</td>
                    <td>{item.quantity}</td>
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

export default CartsPage;
