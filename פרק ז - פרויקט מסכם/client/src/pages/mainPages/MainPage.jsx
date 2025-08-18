import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './MainPage.css';
import { useAuth } from '../../auth/AuthContext';

function MainPage() {
  const [products, setProducts] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [page, setPage] = useState(1);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { isAdmin } = useAuth();

  const loadProducts = async () => {
    try {
      let res;
      if (search && selectedDept) {
        res = await api.searchProductsInDepartment(search, selectedDept, page);
      } else if (search) {
        res = await api.searchProducts(search, page);
      } else if (selectedDept) {
        res = await api.getProductsByDepartment(selectedDept, page);
      } else {
        res = await api.getAllProducts(page);
      }
      setProducts(res.data);
    } catch (err) {
      console.error('❌ שגיאה בקבלת מוצרים:', err.message);
    }
  };

  const loadDepartments = async () => {
    try {
      const res = await api.getDepartments();
      setDepartments(res.data);
    } catch (err) {
      console.error('❌ שגיאה בקבלת מחלקות:', err.message);
    }
  };

  // Sync state from URL on mount and when URL changes
  useEffect(() => {
    const pageParam = parseInt(searchParams.get('page')) || 1;
    const deptParam = searchParams.get('department') || '';
    const searchParam = searchParams.get('search') || '';
    setPage(pageParam);
    setSelectedDept(deptParam);
    setSearch(searchParam);
  }, [searchParams]);

  // Update URL when state changes (but not on first mount)
  useEffect(() => {
    const params = {};
    if (page > 1) params.page = page;
    if (selectedDept) params.department = selectedDept;
    if (search) params.search = search;
    setSearchParams(params, { replace: true });
    loadProducts();
  }, [page, selectedDept, search]);

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDept(e.target.value);
    setPage(1);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('האם למחוק את המוצר?')) return;
    try {
        await api.deleteProduct(productId);
        loadProducts();
    } catch {
        alert('❌ שגיאה במחיקת מוצר');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="text-primary">
                <i className="bi bi-shop"></i> מוצרים
              </h2>
              {isAdmin && (
                <button 
                  className="btn btn-success"
                  onClick={() => navigate('/addProdact')}
                >
                  <i className="bi bi-plus-circle"></i> הוסף מוצר
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="input-group flex-direction-row-reverse">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="חפש מוצר..."
                value={search}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="col-md-6">
            <select 
              className="form-select"
              value={selectedDept} 
              onChange={handleDepartmentChange}
            >
              <option value="">כל המחלקות</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="row">
          {products.length === 0 ? (
            <div className="col-12">
              <div className="alert alert-info text-center">
                <i className="bi bi-info-circle"></i> לא נמצאו מוצרים
              </div>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
                <div className="card h-100 shadow-sm">
                  <div className="card-img-top d-flex justify-content-center align-items-center">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="img-fluid"
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-primary">{product.name}</h5>
                    <p className="card-text text-muted flex-grow-1">{product.description}</p>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="h5 text-success mb-0">
                          ₪ {product.discounted_price}
                        </span>
                        {product.quantity > 0 ? (
                          <span className="badge bg-success">זמין</span>
                        ) : (
                          <span className="badge bg-danger">אזל מהמלאי</span>
                        )}
                      </div>
                      <div className="d-grid gap-2">
                        <button 
                          className="btn btn-primary"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <i className="bi bi-eye"></i> לצפייה
                        </button>
                        {isAdmin && (
                          <button 
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(product.id)}
                          >
                            <i className="bi bi-trash"></i> מחיקה
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="row mt-4">
          <div className="col-12 d-flex justify-content-center">
            <nav aria-label="Page navigation">
              <ul className="pagination flex-direction-row-reverse">
                <li className="page-item">
                  <button 
                    className="page-link"
                    onClick={() => setPage(page + 1)}
                  >
                    הבא <i className="bi bi-chevron-left"></i>
                  </button>
                </li>
                <li className="page-item active">
                  <span className="page-link">עמוד {page}</span>
                </li>
                <li className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                  >
                    <i className="bi bi-chevron-right"></i> הקודם
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;