// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// אימות חובה בכל המסלולים
router.use(verifyToken);

router.get('/', authorizeRoles('admin'), userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.put('/role/:id', authorizeRoles('admin'), userController.updateUserRole);
router.put('/block/:id', authorizeRoles('admin'), userController.blockUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;
