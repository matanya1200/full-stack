// server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();
const socketManager = require('./socketManager');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/departments', require('./routes/departmentsRoutes'));
app.use('/products', require('./routes/productsRoutes'));
app.use('/log', require('./routes/logRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/orders', require('./routes/ordersRoutes'));
app.use('/payment', require('./routes/paymentRoutes'));
app.use('/ranking', require('./routes/rankingRoutes'));
app.use('/restock', require('./routes/restockRoutes'));

const { autoUpdateOrdersToArrived ,autoProcessRestocks } = require('./utils/maintenance');
autoUpdateOrdersToArrived();//כאשר השרת עולה בודקים עם עברו 3 ימים מאז שהחבילה נשלחה
setInterval(autoProcessRestocks, 24 * 60 * 60 * 1000);//פעם ביום מתבצעת בדיקה האם עברו 5 ימים מאז שבוצע הזמנה

// Root
app.get('/', (req, res) => {
  res.send('Server is running...');
});


// Start server
const server = http.createServer(app);
socketManager.initialize(server); // <-- Initialize sockets here

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
