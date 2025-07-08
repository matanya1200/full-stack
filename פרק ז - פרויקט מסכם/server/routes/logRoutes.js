// routes/logRoutes.js
const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { authorizeRoles } = require('../middlewares/roleMiddleware');

// כל הנתיבים דורשים התחברות
router.use(verifyToken);

// כל הלוגים – admin בלבד
router.get('/', authorizeRoles('admin'), logController.getAllLogs);

// לוגים של משתמש מסוים – למשתמש עצמו בלבד
router.get('/:userId', logController.getLogsByUser);

module.exports = router;
