// routes/departmentsRoutes.js
const express = require('express');
const router = express.Router();
const departmentsController = require('../controllers/departmentsController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

router.get('/', departmentsController.getAllDepartments);

// כל הפעולות דורשות התחברות והרשאה של admin
router.use(verifyToken, authorizeRoles('admin'));

router.post('/', departmentsController.createDepartment);
router.delete('/:id', departmentsController.deleteDepartment);

module.exports = router;
