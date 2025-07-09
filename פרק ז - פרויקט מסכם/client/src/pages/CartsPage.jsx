import { useEffect, useState } from 'react';
import api from '../serves/api';
import Navbar from '../components/Navbar';

function CartsPage() {
  const [groupedCarts, setGroupedCarts] = useState({});
  const [userIdFilter, setUserIdFilter] = useState('');
  const [error, setError] = useState('');
  const [expandedUser, setExpandedUser] = useState(null);

  const loadCarts = async () => {
    try {
      setError('');
      let items = [];

      if (userIdFilter) {
        const res = await api.getCartByUser(userIdFilter);
        items = res.data;
      } else {
        const res = await api.getAllCarts();
        items = res.data;
      }

      const grouped = {};
      items.forEach(item => {
        const userId = item.user_id;
        if (!grouped[userId]) {
          grouped[userId] = {
            user_name: item.user_name || 'לא ידוע',
            items: []
          };
        }
        grouped[userId].items.push(item);
      });

      setGroupedCarts(grouped);
    } catch {
      setError('❌ שגיאה בטעינת העגלות');
    }
  };

  useEffect(() => {
    loadCarts();
  }, [userIdFilter]);

  const toggleExpand = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2 className="mb-4 text-primary">
          <i className="bi bi-cart4"></i> עגלות משתמשים
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

        {Object.keys(groupedCarts).length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle"></i> לא נמצאו עגלות
          </div>
        ) : (
          <div className="accordion" id="cartAccordion">
            {Object.entries(groupedCarts).map(([userId, { user_name, items }]) => (
              <div className="accordion-item" key={userId}>
                <h2 className="accordion-header">
                  <button
                    className={`accordion-button ${expandedUser === userId ? '' : 'collapsed'}`}
                    type="button"
                    onClick={() => toggleExpand(userId)}
                  >
                    🧑 משתמש #{userId} – {user_name}
                  </button>
                </h2>
                <div className={`accordion-collapse collapse ${expandedUser === userId ? 'show' : ''}`}>
                  <div className="accordion-body">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>שם מוצר</th>
                          <th>כמות</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.product_name}</td>
                            <td>{item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default CartsPage;
