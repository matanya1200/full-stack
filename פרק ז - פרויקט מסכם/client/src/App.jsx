import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';
import ProductPage from './pages/ProductPage';
import AddRatingPage from './pages/AddRatingPage';
import CartPage from './pages/CartPage';
import PaymentPage from './pages/PaymentPage';
import OrdersPage from './pages/OrdersPage';
import AllOrdersPage from './pages/allOrdersPage';
import OrderItemsPage from './pages/OrderItemsPage';
import UserLogPage from './pages/UserLogPage';
import UserPage from './pages/UserPage';
import EditProductPage from './pages/EditProductPage';
import PendingRestockPage from './pages/PendingRestockPage';
import AddRestockPage from './pages/AddRestockPage';
import RestockPage from './pages/RestockPage';
import EditRestockPage from './pages/EditRestockPage';
import EditUserPage from './pages/EditUserPage';
import UsersPage from './pages/UsersPage';
import DepartmentsPage from './pages/DepartmentsPage';
import AddProductPage from './pages/AddProductPage';
import CartsPage from './pages/CartsPage';
import AllLogsPage from './pages/AllLogsPage';


function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false)
  }, [])
  
  if (loading) {
    return <div className="text-center mt-5">טוען...</div> // או Spinner אם אתה רוצה
  }
  //const user = JSON.parse(localStorage.getItem('user'));

  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={user ? <MainPage /> : <Navigate to="/login" />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/addRating/:product_id" element={<AddRatingPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/allOrders" element={<AllOrdersPage />} />
        <Route path="/orderItems/:order_id" element={<OrderItemsPage />} />
        <Route path="/log" element={<UserLogPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/editProduct/:product_id" element={<EditProductPage />} />
        <Route path="/pendingRestock" element={<PendingRestockPage />} />
        <Route path="/addRestock" element={<AddRestockPage />} />
        <Route path="/addRestock/:id" element={<AddRestockPage />} />
        <Route path="/Restock" element={<RestockPage />} />
        <Route path="/editRestock" element={<EditRestockPage />} />
        <Route path="/editUser" element={<EditUserPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/department" element={<DepartmentsPage />} />
        <Route path="/addProdact" element={<AddProductPage />} />
        <Route path="/carts" element={<CartsPage />} />
        <Route path="/allLogs" element={<AllLogsPage />} />
      </Routes>
  );
}

export default App;
