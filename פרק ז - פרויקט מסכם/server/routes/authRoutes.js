// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// רישום משתמש
router.post('/register', authController.register);

// התחברות
router.post('/login', authController.login);

module.exports = router;
