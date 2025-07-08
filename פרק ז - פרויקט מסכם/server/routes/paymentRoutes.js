const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.use(verifyToken); // כל הפעולות מחייבות התחברות

router.get('/:user_id', paymentController.getPayment);
router.post('/', paymentController.createPayment);
router.put('/:user_id', paymentController.updatePayment);
router.delete('/:user_id', paymentController.deletePayment);

module.exports = router;
