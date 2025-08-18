// controllers/authController.js
const db = require('../db');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePasswords } = require('../utils/hashUtils');
const { logActivity } = require('../utils/logger');
const transactionManager = require('../utils/transactionManager');
const transactionHTTPError = require('../utils/transactionHTTPError');
require('dotenv').config();

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}


exports.register = async (req, res) => {
  const { name, email, password, address } = req.body;

  await transactionManager.withTransaction(async (conn) => {
    try {
      const [existingUser] = await conn.query('SELECT * FROM Users WHERE email = ?', [email]);
      if (existingUser.length > 0) {
        throw new transactionHTTPError(400, 'User already exists');
      }

      const hashed = await hashPassword(password);

      const [result] = await conn.query(
        `INSERT INTO Users (name, email, password_hash, address, role, is_blocked)
         VALUES (?, ?, ?, ?, 'customer', false)`,
        [name, email, hashed, address]
      );
      
      const user = {
        id: result.insertId,
        email,
        role: 'customer'
      };
      
      const token = generateToken(user);
      res.status(201).json({ message: 'User registered', token,
        id: user.id,
        email: user.email,
        name: user.name,
        role:user.role
      });
      await logActivity(user.id, 'Register', conn);
      throw new transactionHTTPError(201, 'User registered', { token,
        id: user.id,
        email: user.email,
        name: user.name,
        role:user.role
      });
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message, ...err.data });
      } else {
        res.status(500).json({ message: 'Registration failed', error: err.message });
      }
    }
  });
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  await transactionManager.withTransaction(async (conn) => {
    try {
      const [users] = await conn.query('SELECT * FROM Users WHERE email = ?', [email]);
      if (users.length === 0) {
        throw new transactionHTTPError(400, 'Invalid email or password');
      }
      
      const user = users[0];
      
      if (user.is_blocked) {
        return res.status(403).json({ message: 'User is blocked' });
      }
      
      const isMatch = await comparePasswords(password, user.password_hash);
      if (!isMatch) {
        throw new transactionHTTPError(400, 'Invalid email or password');
      }
      
      const token = generateToken(user);
      await logActivity(user.id, 'Login', conn);
      throw new transactionHTTPError(200, 'Login successful', { token, 
        id: user.id,
        email: user.email,
        name: user.name,
        role:user.role,
        department_id: user.department_id
      });
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message, ...err.data });
      } else {
        res.status(500).json({ message: 'Login failed', error: err.message });
      }
    }
  });
};