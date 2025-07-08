// controllers/authController.js
const db = require('../db');
const jwt = require('jsonwebtoken');
const { hashPassword, comparePasswords } = require('../utils/hashUtils');
const { logActivity } = require('../utils/logger');
require('dotenv').config();

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}


exports.register = async (req, res) => {
  const { name, email, password, address } = req.body;

  try {
    const [existingUser] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashed = await hashPassword(password);

    const [result] = await db.query(
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
     await logActivity(user.id, 'Register');
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const user = users[0];

    if (user.is_blocked) {
      return res.status(403).json({ message: 'User is blocked' });
    }

    const isMatch = await comparePasswords(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    res.status(200).json({ message: 'Login successful', token, 
      id: user.id,
      email: user.email,
      name: user.name,
      role:user.role,
      department_id: user.department_id
     });
     await logActivity(user.id, 'Login');
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};