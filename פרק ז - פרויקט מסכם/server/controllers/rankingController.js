const db = require('../db');

// ✔️ POST /rank – הוספת תגובה ודירוג
exports.addRank = async (req, res) => {
  const userId = req.user.id;
  const { product_id, comment, rating } = req.body;

  if (!product_id || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Invalid product or rating' });
  }

  try {
    //בדיקה האם המשתמש קנה את המוצר?
    const [purchases] = await db.query(
      `SELECT oi.*
       FROM OrderItems oi
       JOIN Orders o ON oi.order_id = o.id
       WHERE o.user_id = ? AND oi.product_id = ?`,
      [userId, product_id]
    );

    if (purchases.length === 0) {
      return res.status(403).json({ message: 'You can only rate products you have purchased' });
    }

    // בדיקה אם כבר דירג
    const [existing] = await db.query(
      'SELECT * FROM Ranking WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'You already rated this product' });
    }

    await db.query(
      'INSERT INTO Ranking (product_id, user_id, comment, rating) VALUES (?, ?, ?, ?)',
      [product_id, userId, comment || '', rating]
    );

    res.status(201).json({ message: 'Rating submitted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit rating', error: err.message });
  }
};

// ✔️ GET /rank – כל הדירוגים
exports.getAllRanks = async (req, res) => {
  try {
    const [ranks] = await db.query(`
      SELECT r.*, u.name AS user_name, p.name AS product_name
      FROM Ranking r
      JOIN Users u ON r.user_id = u.id
      JOIN Products p ON r.product_id = p.id
    `);
    res.json(ranks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ranks', error: err.message });
  }
};

// ✔️ GET /rank/:user_id – דירוגים של משתמש
exports.getRanksByUser = async (req, res) => {
  const userId = parseInt(req.params.user_id);
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const [ranks] = await db.query(
      `SELECT r.*, p.name AS product_name
       FROM Ranking r
       JOIN Products p ON r.product_id = p.id
       WHERE r.user_id = ?`,
      [userId]
    );
    res.json(ranks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user ranks', error: err.message });
  }
};

exports.getRanksByProduct = async (req, res) => {
  const productId = parseInt(req.params.product_id);

  try {
    const [ranks] = await db.query(
      `SELECT r.id, r.comment, r.rating, u.name AS user_name, p.name AS product_name
       FROM Ranking r
       JOIN Users u ON r.user_id = u.id
       JOIN Products p ON r.product_id = p.id
       WHERE r.product_id = ?`,
      [productId]
    );

    res.json(ranks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product ratings', error: err.message });
  }
};

exports.getAverageRating = async (req, res) => {
  const productId = parseInt(req.params.product_id);

  try {
    const [result] = await db.query(
      `SELECT ROUND(AVG(rating), 2) AS average, COUNT(*) AS total
       FROM Ranking
       WHERE product_id = ?`,
      [productId]
    );

    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch average rating', error: err.message });
  }
};

// ✔️ PUT /rank/:id – עריכת דירוג
exports.updateRank = async (req, res) => {
  const rankId = parseInt(req.params.id);
  const userId = req.user.id;
  const { comment, rating } = req.body;

  if (rating != null && (rating < 1 || rating > 5)) {
    return res.status(400).json({ message: 'Invalid rating' });
  }

  try {
    const [ranks] = await db.query('SELECT * FROM Ranking WHERE id = ?', [rankId]);
    if (ranks.length === 0 || ranks[0].user_id !== userId) {
      return res.status(403).json({ message: 'Cannot edit this rating' });
    }

    const fields = [];
    const values = [];

    if (comment !== undefined) {
    fields.push('comment = ?');
    values.push(comment);
    }

    if (rating != null) {
    fields.push('rating = ?');
    values.push(rating);
    }

    if (fields.length === 0) {
    return res.status(400).json({ message: 'Nothing to update' });
    }

    values.push(rankId);

    await db.query(
    `UPDATE Ranking SET ${fields.join(', ')} WHERE id = ?`,
    values
    );

    res.json({ message: 'Rating updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update rating', error: err.message });
  }
};

// ✔️ DELETE /rank/:id – מחיקת דירוג
exports.deleteRank = async (req, res) => {
  const rankId = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    const [ranks] = await db.query('SELECT * FROM Ranking WHERE id = ?', [rankId]);
    if (ranks.length === 0 || ranks[0].user_id !== userId) {
      return res.status(403).json({ message: 'Cannot delete this rating' });
    }

    await db.query('DELETE FROM Ranking WHERE id = ?', [rankId]);
    res.json({ message: 'Rating deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete rating', error: err.message });
  }
};
