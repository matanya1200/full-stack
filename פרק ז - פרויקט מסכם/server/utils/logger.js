// utils/logger.js
const db = require('../db');

async function logActivity(user_id, activity) {
  try {
    await db.query(
      'INSERT INTO UserLogs (user_id, activity) VALUES (?, ?)',
      [user_id, activity]
    );
  } catch (err) {
    console.error('⚠️ Failed to log activity:', err.message);
  }
}

module.exports = { logActivity };
