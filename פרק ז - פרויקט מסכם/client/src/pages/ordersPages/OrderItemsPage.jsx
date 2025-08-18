import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../auth/AuthContext';

function OrderItemsPage() {
  // const user = JSON.parse(localStorage.getItem('user'));
  const { order_id } = useParams();
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const loadItems = async () => {
    try {
      const res = await api.getOrderItemsByOrder(user.id, order_id);
      setItems(res.data);
    } catch (err) {
      setError('❌ שגיאה בטעינת פרטי ההזמנה');
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="text-center text-primary mb-4">
          <i className="bi bi-receipt"></i> פרטי הזמנה #{order_id}
        </h2>

        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {items.length === 0 ? (
          <div className="alert alert-warning text-center">
            <i className="bi bi-exclamation-circle"></i> אין לך גישה לפרטי הזמנה זו
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered text-center align-middle">
              <thead className="table-light">
                <tr>
                  <th>שם מוצר</th>
                  <th>כמות</th>
                  <th>מחיר ליחידה</th>
                  <th>סה"כ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i}>
                    <td>{item.product_name}</td>
                    <td>{item.quantity}</td>
                    <td>₪ {item.price.toFixed(2)}</td>
                    <td>₪ {(item.price * item.quantity).toFixed(2)}</td>
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

export default OrderItemsPage;
