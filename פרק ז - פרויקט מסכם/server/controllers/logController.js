// controllers/logController.js
const db = require('../db');

// ✅ קבלת כל הלוגים – למנהל בלבד
exports.getAllLogs = async (req, res) => {
  try {
    const [logs] = await db.query(`
      SELECT l.id, l.user_id, u.name, l.activity, l.date
      FROM UserLogs l
      JOIN Users u ON l.user_id = u.id
      ORDER BY l.date DESC
    `);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch logs', error: err.message });
  }
};

// ✅ קבלת הלוגים של משתמש מסוים (רק ע"י אותו משתמש)
exports.getLogsByUser = async (req, res) => {
  const userId = parseInt(req.params.userId);

  if (req.user.id !== userId && req.user.role != 'admin') {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const [logs] = await db.query(
      'SELECT id, activity, date FROM UserLogs WHERE user_id = ? ORDER BY date DESC',
      [userId]
    );
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user logs', error: err.message });
  }
};
