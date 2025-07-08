// routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// כל הנתיבים מחייבים התחברות
router.use(verifyToken);

// GET /cart – למנהל בלבד
router.get('/', authorizeRoles('admin'), cartController.getAllCarts);

//GET /curt/:user_id/product/:product_id
router.get('/:user_id/product/:product_id', cartController.getCartItem);

// GET /cart/:user_id – למשתמש עצמו בלבד
router.get('/:user_id', cartController.getCartByUser);

// POST /cart – הוספת מוצר לסל
router.post('/', cartController.addToCart);

//PUT /curt/:user_id/product/:product_id
router.put('/:user_id/product/:product_id', cartController.updateCartProduct);

// DELETE /cart/:id – הסרה מהעגלה
router.delete('/:id', cartController.deleteCartItem);

module.exports = router;
