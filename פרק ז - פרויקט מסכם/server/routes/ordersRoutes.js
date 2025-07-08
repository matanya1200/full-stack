const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// כל הנתיבים דורשים התחברות
router.use(verifyToken);

// GET
router.get('/', authorizeRoles('admin'), ordersController.getAllOrders);
router.get('/items', authorizeRoles('admin'), ordersController.getAllOrderItems);
router.get('/:user_id', ordersController.getOrdersByUser);
router.get('/items/:user_id', ordersController.getOrdersItemsByUser); // לא ממש נצרך
router.get('/items/:user_id/:order_id', ordersController.getOrderItemsByUser);

// POST
router.post('/buy', ordersController.buy);

module.exports = router;
