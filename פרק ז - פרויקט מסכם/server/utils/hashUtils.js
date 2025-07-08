// utils/hashUtils.js
const bcrypt = require('bcrypt');

// כמה סיבובים של salt נרצה לבצע (10 זו ברירת מחדל סבירה)
const SALT_ROUNDS = 10;

/**
 * מקבלת סיסמה רגילה ומחזירה את ה-Hash שלה
 */
async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * מקבלת סיסמה רגילה ו-Hash, ובודקת אם הן תואמות
 */
async function comparePasswords(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  hashPassword,
  comparePasswords
};
