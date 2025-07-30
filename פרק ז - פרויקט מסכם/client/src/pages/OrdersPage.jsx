import { useEffect, useState } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

function OrdersPage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadOrders = async () => {
    try {
      let res = await api.getOrdersByUser(user.id)
      setOrders(res.data);
    } catch (err) {
      setError('שגיאה בטעינת הזמנות');
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleRowClick = (orderId) => {
    navigate(`/orderItems/${orderId}`);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'pending': 'warning',
      'completed': 'success',
      'cancelled': 'danger'
    };
    return statusMap[status] || 'secondary';
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-12">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white">
                <h2 className="mb-0">
                  <i className="bi bi-box-seam me-2"></i>
                  ההזמנות שלי
                </h2>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                  </div>
                )}
                
                {orders.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-box display-1 text-muted"></i>
                    <p className="text-muted fs-5 mt-3">לא נמצאו הזמנות</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th scope="col">
                            <i className="bi bi-hash me-1"></i>
                            מספר הזמנה
                          </th>
                          {user.role === 'admin' && (
                            <th scope="col">
                              <i className="bi bi-person me-1"></i>
                              מזהה משתמש
                            </th>
                          )}
                          <th scope="col">
                            <i className="bi bi-calendar me-1"></i>
                            תאריך
                          </th>
                          <th scope="col">
                            <i className="bi bi-currency-shekel me-1"></i>
                            סכום כולל
                          </th>
                          <th scope="col">
                            <i className="bi bi-info-circle me-1"></i>
                            סטטוס
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr 
                            key={order.id} 
                            onClick={() => handleRowClick(order.id)} 
                            className="cursor-pointer"
                            style={{ cursor: 'pointer' }}
                          >
                            <td>
                              <span className="badge bg-light text-dark">
                                #{order.id}
                              </span>
                            </td>
                            {user.role === 'admin' && (
                              <td>
                                <span className="badge bg-info">
                                  {order.user_id}
                                </span>
                              </td>
                            )}
                            <td>
                              <i className="bi bi-calendar3 me-1"></i>
                              {new Date(order.created_at).toLocaleDateString('he-IL')}
                            </td>
                            <td>
                              <span className="fw-bold text-success">
                                ₪{order.total_price}
                              </span>
                            </td>
                            <td>
                              <span className={`badge bg-${getStatusBadge(order.status)}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrdersPage;