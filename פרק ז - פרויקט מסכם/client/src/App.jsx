import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react'
import LoginPage from './pages/loginPages/LoginPage';
import RegisterPage from './pages/loginPages/RegisterPage';
import MainPage from './pages/mainPage/MainPage';
import ProductPage from './pages/productsPages/ProductPage';
import AddRatingPage from './pages/ratingsPages/AddRatingPage';
import CartPage from './pages/cartPages/CartPage';
import PaymentPage from './pages/paymentPages/PaymentPage';
import OrdersPage from './pages/ordersPages/OrdersPage';
import AllOrdersPage from './pages/ordersPages/AllOrdersPage';
import OrderItemsPage from './pages/ordersPages/OrderItemsPage';
import UserLogPage from './pages/userPages/UserLogPage';
import UserPage from './pages/userPages/UserPage';
import EditProductPage from './pages/productsPages/EditProductPage';
import PendingRestockPage from './pages/restockPages/PendingRestockPage';
import AddRestockPage from './pages/restockPages/AddRestockPage';
import RestockPage from './pages/restockPages/RestockPage';
import EditRestockPage from './pages/restockPages/EditRestockPage';
import EditUserPage from './pages/userPages/EditUserPage';
import UsersPage from './pages/userPages/UsersPage';
import DepartmentsPage from './pages/departmentsPages/DepartmentsPage';
import AddProductPage from './pages/productsPages/AddProductPage';
import CartsPage from './pages/cartPages/CartsPage';
import AllLogsPage from './pages/logsPages/AllLogsPage';
import Notification from './components/Notification';
import ChatIcon from "./components/AIChat/ChatIcon";
import ChatWidget from "./components/AIChat/ChatWidget";

import socketService from './services/socketService';

import './app.css';


function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false);
  
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (user) {
    socketService.initialize(user.id);
    } else {
    socketService.disconnect();
    }
  }, [user])
  
  if (loading) {
    return <div className="text-center mt-5">טוען...</div> // או Spinner אם אתה רוצה
  }

  return (
    <>
      <Notification />
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
      <ChatIcon onClick={() => setChatOpen(true)} />
      <ChatWidget open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}

export default App;
