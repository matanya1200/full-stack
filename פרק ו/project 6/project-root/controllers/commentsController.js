const db = require('../db');

// GET /comments OR /comments?postId=...
// וגם יתמוך ב- /posts/:postId/comments
exports.getAllCommentsByPost = async (req, res) => {
  const postId = req.query.postId || req.params.postId;

  try {
    let query = `
      SELECT *
      FROM comments
    `;
    const params = [];

    if (postId) {
      query += ' WHERE post_id = ?';
      params.push(postId);
    }

    const [rows] = await db.query(query, params);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'post not found' });
    }
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /posts/:postId/comments/:commentId
exports.getCommentById = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM comments WHERE id = ? AND post_id = ?',
      [commentId, postId]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Comment not found' });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /posts/:postId/comments
exports.createComment = async (req, res) => {
  const postId = req.params.postId;
  const { name, email, body } = req.body;

  if (!name || !email || !body) {
    return res.status(400).json({ message: 'חסרים שדות' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO comments (post_id, name, email, body) VALUES (?, ?, ?, ?)',
      [postId, name, email, body]
    );

    res.status(201).json({
      id: result.insertId,
      post_id: postId,
      name,
      email,
      body,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /posts/:postId/comments/:commentId
exports.updateComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { name, body, email } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM comments WHERE id = ? AND post_id = ?',
      [commentId, postId]
    );
    if (!rows.length || rows[0].email !== email) {
      return res.status(403).json({ message: 'אין הרשאה לעדכן תגובה זו' });
    }

    const [result] = await db.query(
      'UPDATE comments SET name = ?, email = ?, body = ? WHERE id = ? AND post_id = ?',
      [name, email, body, commentId, postId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Comment not found' });

    res.status(200).json({ message: 'Comment updated' });
  } catch (error) {
    console.error('Error updating comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /posts/:postId/comments/:commentId
exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { email } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM comments WHERE id = ? AND post_id = ?',
      [commentId, postId]
    );
    if (!rows.length || rows[0].email !== email) {
      return res.status(403).json({ message: 'אין הרשאה למחוק תגובה זו' });
    }

    const [result] = await db.query(
      'DELETE FROM comments WHERE id = ? AND post_id = ?',
      [commentId, postId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Comment not found' });

    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
