// routes/productsRoutes.js
const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');


router.use(verifyToken);

// מוצרים פתוחים לכולם 
router.get('/all', productsController.getAllProductsWithoutPage);
router.get('/', productsController.getAllProducts);
router.get('/search', productsController.searchProducts);
router.get('/searchDepartment', productsController.searchProductsInDepartment);
router.get('/department/:id', productsController.getByDepartment);
router.get('/:id', productsController.getProductById);

// יצירת מוצר (admin בלבד)
router.post('/', authorizeRoles('admin'), productsController.createProduct);

// עריכת מוצר (admin או עובד במחלקה)
router.put('/:id', productsController.updateProduct);

// מחיקת מוצר (admin בלבד)
router.delete('/:id', authorizeRoles('admin'), productsController.deleteProduct);

module.exports = router;