// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * מוודא שמשתמש שלח טוקן תקני ב-headers ומפענח אותו
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // נשמור את פרטי המשתמש בטוקן
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = {
  verifyToken
};
