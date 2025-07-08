// scripts/createAdmin.js
const db = require('../db');
const { hashPassword } = require('../utils/hashUtils');

async function createAdmin() {
  try {
    const name = 'Admin User';
    const email = 'admin@example.com';
    const password = 'admin123'; // תוכל לשנות לסיסמה אחרת
    const hashedPassword = await hashPassword(password);

    // בדיקה אם כבר קיים משתמש כזה
    const [existing] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('❗ משתמש עם מייל זה כבר קיים');
      return;
    }

    // הכנסת משתמש חדש עם תפקיד 'admin'
    await db.query(
      `INSERT INTO Users (name, email, password_hash, role, is_blocked)
       VALUES (?, ?, ?, 'admin', FALSE)`,
      [name, email, hashedPassword]
    );

    console.log('✅ משתמש מנהל נוצר בהצלחה');
  } catch (err) {
    console.error('❌ שגיאה ביצירת משתמש מנהל:', err.message);
  } finally {
    process.exit();
  }
}

createAdmin();
