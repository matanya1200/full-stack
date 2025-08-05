
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import './AddRatingPage.css';

function AddRatingPage() {
  const { product_id } = useParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (rating < 1 || rating > 5) {
      setError('⭐ הדירוג חייב להיות בין 1 ל-5');
      return;
    }

    try {
      await api.addRank({ product_id, rating, comment });
      navigate(`/product/${product_id}`);
    } catch (err) {
      setError(err.response?.data?.message || '❌ שגיאה בהוספת דירוג');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="card add-rating-card">
          <div className="card-header add-rating-header">
            <h4 className="mb-0"><i className="bi bi-star-fill"></i> הוספת דירוג</h4>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">⭐ דירוג (1–5):</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">📝 תגובה (לא חובה):</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-success">
                  <i className="bi bi-check-circle"></i> שלח דירוג
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddRatingPage;
