// middlewares/roleMiddleware.js

/**
 * מקבל רשימת תפקידים ומאשר גישה רק אם המשתמש מחזיק באחד מהם
 */
function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient permissions' });
    }
    next();
  };
}

module.exports = {
  authorizeRoles
};
