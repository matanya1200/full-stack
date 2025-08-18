// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

// secured connection to get canonical user info
router.get('/me', verifyToken, async (req, res) => {
  // req.user is set by authMiddleware after verifying JWT
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role, // "admin" | "customer" | ...
  });
});

// רישום משתמש
router.post('/register', authController.register);

// התחברות
router.post('/login', authController.login);

module.exports = router;
