import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Navbar from '../../components/Navbar';
import './ProductPage.css'
import { useAuth } from '../../auth/AuthContext';

function ProductPage() {
  const { id } = useParams();
  // const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [averageRating, setAverageRating] = useState(null);
  const { user, isAdmin, isStoreKeeper, isWorker } = useAuth();

  useEffect(() => {
    fetchProduct();
    fetchRatings();
    fetchAverage();
  }, [id]);

  const fetchAverage = async() => {
    try{
     const res = await api.getProductAverageRank(id);
     setAverageRating(res.data.average || null);
    } catch (err) {
      setAverageRating(null);
      setError('שגיאה בקבלת ממוצע דירוגים');
    }
  }

  const fetchProduct = async () => {
    try {
      const res = await api.getProduct(id);
      setProduct(res.data);
    } catch (err) {
      setError('שגיאה בקבלת המוצר');
    }
  };

  const fetchRatings = async () => {
    try {
      const res = await api.getRanksByProduct(id);
      setRatings(res.data);
    } catch {
      setRatings([]);
    }
  };

  const handleAddToCart = async () => {
    try {
      await api.addToCart({ product_id: id, quantity:quantity });
      alert('המוצר נוסף לעגלה');
    } catch (err) {
      setError(err.response?.data?.message || 'שגיאה בהוספה לעגלה');
    }
  };

  const handleDeleteRank = async (rankId) => {
    try {
        await api.deleteRank(rankId);
        fetchRatings();
        fetchAverage();
    } catch {
        alert('❌ שגיאה במחיקת דירוג');
    }
  };

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container mt-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">טוען...</span>
            </div>
            <p className="mt-3">טוען...</p>
          </div>
        </div>
      </>
    );
  }

  const canEdit =
    isAdmin ||
    (isWorker && user.department_id === product.department_id);    

  const canRestock =
    isAdmin ||
    (isWorker && user.department_id === product.department_id)||
    isStoreKeeper;

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        {error && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle"></i> {error}
          </div>
        )}

        <div className="row">
          {/* Product Image */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-body text-center">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="img-fluid rounded product-image"
                />
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h1 className="card-title text-primary">{product.name}</h1>
                <p className="card-text text-muted">{product.description}</p>
                
                <div className="row mb-3">
                  <div className="col-6">
                    <h4 className="text-success">
                      ₪ {product.discounted_price}
                    </h4>
                  </div>
                  <div className="col-6">
                    {product.quantity > 0 ? (
                      <span className="badge bg-success fs-6">
                        <i className="bi bi-check-circle"></i> זמין ({product.quantity})
                      </span>
                    ) : (
                      <span className="badge bg-danger fs-6">
                        <i className="bi bi-x-circle"></i> אזל מהמלאי
                      </span>
                    )}
                  </div>
                </div>

                {/* Average Rating */}
                {averageRating !== null && (
                  <div className="mb-3">
                    <div className="d-flex align-items-center">
                      <span className="text-warning me-2">
                        דירוג ממוצע: {averageRating !== null ? averageRating : 'אין'}<br></br>
                        {'⭐'.repeat(Math.floor(averageRating))}
                      </span>
                    </div>
                  </div>
                )}

                {/* Quantity Selection */}
                <div className="mb-3">
                  <label className="form-label">כמות:</label>
                  <div className="input-group flex-direction-row-reverse mw-200">
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      max={product.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                    <button 
                      className="btn btn-primary"
                      onClick={handleAddToCart}
                      disabled={product.quantity === 0}
                    >
                      <i className="bi bi-cart-plus"></i> הוסף לעגלה
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <button 
                    className="btn btn-warning"
                    onClick={() => navigate(`/addRating/${id}`)}
                  >
                    <i className="bi bi-star"></i> הוסף דירוג
                  </button>
                  
                  {canEdit && (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => navigate(`/editProduct/${id}`)}
                    >
                      <i className="bi bi-pencil"></i> ערוך מוצר
                    </button>
                  )}
                  
                  {canRestock && (
                    <button 
                      className="btn btn-info"
                      onClick={() => navigate(`/addRestock/${id}`)}
                    >
                      <i className="bi bi-box"></i> הוסף הזמנה
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ratings Section */}
        <div className="row mt-4">
          <div className="col-12">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h3 className="card-title mb-0">
                  <i className="bi bi-star-fill"></i> דירוגים
                </h3>
              </div>
              <div className="card-body">
                {ratings.length === 0 ? (
                  <div className="text-center text-muted">
                    <i className="bi bi-star display-4"></i>
                    <p className="mt-2">אין דירוגים עדיין</p>
                  </div>
                ) : (
                  <div className="row">
                    {ratings.map((r) => (
                      <div key={r.id} className="col-lg-6 mb-3">
                        <div className="card border-start border-warning border-3">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <div className="text-warning mb-1">
                                  {'⭐'.repeat(r.rating)}
                                  <span className="text-muted ms-1">({r.rating}/5)</span>
                                </div>
                                <p className="card-text">{r.comment}</p>
                              </div>
                              {r.user_id === user?.id && (
                                <button 
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => handleDeleteRank(r.id)}
                                  title="מחק דירוג"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
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

export default ProductPage;