import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

const createAxios = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  });
};

const api = {
  // 🔐 Auth
  whoAmI: () => createAxios().get('/auth/me'),
  login: (data) => axios.post(`${BASE_URL}/auth/login`, data),
  register: (data) => axios.post(`${BASE_URL}/auth/register`, data),

  // 👤 Users
  getAllUsers: () => createAxios().get('/users'),
  getUser: (id) => createAxios().get(`/users/${id}`),
  updateUser: (id, data) => createAxios().put(`/users/${id}`, data),
  updateUserRole: (id, data) => createAxios().put(`/users/role/${id}`, data),
  blockUser: (id, data) => createAxios().put(`/users/block/${id}`, data),
  deleteUser: (id) => createAxios().delete(`/users/${id}`),

  // 🏷️ Departments
  getDepartments: () => createAxios().get('/departments'),
  createDepartment: (data) => createAxios().post('/departments', data),
  //deleteDepartment: (id) => createAxios().delete(`/departments/${id}`),

  // 📦 Products
  getAllProducts: (page = 1) => createAxios().get(`/products?page=${page}`),
  getAllProductsWithoutPage: () => createAxios().get(`/products/all`),
  getProductsByDepartment: (departmentId, page = 1) => createAxios().get(`/products/department/${departmentId}?page=${page}`),
  searchProducts: (search, page = 1) => createAxios().get(`/products/search?search=${search}&page=${page}`),
  searchProductsInDepartment: (search, departmentId, page = 1) => createAxios().get(`/products/searchDepartment?search=${search}&department=${departmentId}&page=${page}`),
  getProduct: (id) => createAxios().get(`/products/${id}`),
  createProduct: (data) => createAxios().post('/products', data),
  updateProduct: (id, data) => createAxios().put(`/products/${id}`, data),
  deleteProduct: (id) => createAxios().delete(`/products/${id}`),

  // 🛒 Cart
  getAllCarts: () => createAxios().get('/cart'),
  getCartByUser: (userId) => createAxios().get(`/cart/${userId}`),
  addToCart: (data) => createAxios().post('/cart', data),
  deleteCartItem: (id) => createAxios().delete(`/cart/${id}`),
  updateCartItem: (userId, productId, data) => createAxios().put(`/cart/${userId}/product/${productId}`, data),
  getCartItem: (userId, productId) => createAxios().get(`/cart/${userId}/product/${productId}`),

  // 🔁 Restock
  getRestockList: () => createAxios().get('/restock'),
  getPendingRestocks: () => createAxios().get('/restock/pending'),
  updateRestock: (id, data) => createAxios().put(`/restock/${id}`, data),
  addRestock: (data) => createAxios().post('/restock', data),
  deleteRestock: (id) => createAxios().delete(`/restock/${id}`),

  // 🌟 Ranking
  addRank: (data) => createAxios().post('/ranking', data),
  getAllRanks: () => createAxios().get('/ranking'),
  getRanksByUser: (userId) => createAxios().get(`/ranking/${userId}`),
  updateRank: (id, data) => createAxios().put(`/ranking/${id}`, data),
  deleteRank: (id) => createAxios().delete(`/ranking/${id}`),
  getRanksByProduct: (productId) => createAxios().get(`/ranking/product/${productId}`),
  getProductAverageRank: (productId) => createAxios().get(`/ranking/product/${productId}/average`),

  // 📦 Orders
  getAllOrders: () => createAxios().get('/orders'),
  getOrdersByUser: (userId) => createAxios().get(`/orders/${userId}`),
  getAllOrderItems: () => createAxios().get('/orders/items'),
  getOrderItemsByUser: (userId) => createAxios().get(`/orders/items/${userId}`),
  getOrderItemsByOrder: (userId, orderId) => createAxios().get(`/orders/items/${userId}/${orderId}`),
  buy: () => createAxios().post('/orders/buy'),

  // 💳 Payment
  getPayment: (userId) => createAxios().get(`/payment/${userId}`),
  createPayment: (data) => createAxios().post('/payment', data),
  updatePayment: (userId, data) => createAxios().put(`/payment/${userId}`, data),
  deletePayment: (userId) => createAxios().delete(`/payment/${userId}`),

  // 📜 Logs
  getAllLogs: () => createAxios().get('/log'),
  getLogsByUser: (userId) => createAxios().get(`/log/${userId}`),
};

export default api;
