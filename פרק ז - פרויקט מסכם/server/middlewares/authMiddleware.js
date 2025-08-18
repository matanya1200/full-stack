// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function decodeToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("received authHeader: ", authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }
  const token = authHeader.split(' ')[1];
  try {
    req.user = decodeToken(token);
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = {
  verifyToken,
  decodeToken
};