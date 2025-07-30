import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

function CartPage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  const loadCart = async () => {
    try {
      const res = await api.getCartByUser(user.id);
      setItems(res.data);
      calculateTotal(res.data);
    } catch (err) {
      setError('שגיאה בטעינת עגלה');
    }
  };

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(total);
  };

  const handleUpdateQuantity = async (product_id, currentQty) => {
    const newQty = parseInt(prompt('הזן כמות חדשה:', currentQty));
    if (isNaN(newQty) || newQty < 0) return;
    try {
      await api.updateCartItem(user.id, product_id, { quantity: newQty });
      loadCart();
    } catch (err) {
      alert(err.response?.data?.message || 'שגיאה בעדכון כמות');
    }
  };

  const handleBuy = async () => {
    try {
      await api.buy();
      alert('✅ הרכישה הושלמה!');
      loadCart();
    } catch (err) {
      alert(err.response?.data?.message || '❌ שגיאה בביצוע קנייה');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await api.deleteCartItem(itemId);
      loadCart();
    } catch {
      alert('❌ שגיאה במחיקה מהעגלה');
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-primary text-center mb-4">
          <i className="bi bi-cart"></i> עגלת קניות
        </h2>

        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {items.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle"></i> אין פריטים בעגלה
          </div>
        ) : (
          <>
            <table className="table table-striped table-hover text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>שם</th>
                  <th>מחיר ליחידה</th>
                  <th>כמות</th>
                  <th>סה"כ</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.product_id}>
                    <td>{item.product_name}</td>
                    <td>₪{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>₪{(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleUpdateQuantity(item.product_id, item.quantity)}
                          title="עדכן כמות"
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(item.id)}
                          title="מחק פריט"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-end mt-4">
              <h4 className="text-success">
                סה"כ לתשלום: ₪{total.toFixed(2)}
              </h4>
              <button
                className="btn btn-success btn-lg mt-2"
                onClick={handleBuy}
              >
                <i className="bi bi-credit-card"></i> בצע קנייה
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default CartPage;
