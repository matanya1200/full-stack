const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const usersController = require('../controllers/usersController');

router.post('/login', authController.login);
router.post('/register', usersController.createUser);

module.exports = router;
