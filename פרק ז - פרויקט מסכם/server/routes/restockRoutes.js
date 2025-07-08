const express = require('express');
const router = express.Router();
const restockController = require('../controllers/restockController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.use(verifyToken);

router.get('/', authorizeRoles('admin', 'storekeeper'), restockController.getAllRestocks);

router.get('/pending', authorizeRoles('admin', 'storekeeper', 'worker'), restockController.getPendingRestocks);

router.post('/', authorizeRoles('admin', 'storekeeper', 'worker'), restockController.addRestock);

router.put('/:id', authorizeRoles('storekeeper'), restockController.updateRestock);

router.delete('/:id', authorizeRoles('storekeeper'), restockController.deleteRestock);

module.exports = router;
