const db = require('../db');

// GET /posts
exports.getAllPosts = async (req, res) => {
  try {
    const { user_id } = req.query;

    let query = `
      SELECT posts.*, users.name AS user_name
      FROM posts
      JOIN users ON posts.user_id = users.id
    `;
    const params = [];

    if (user_id) {
      query += ' WHERE posts.user_id = ?';
      params.push(user_id);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);

  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// GET /posts/:id
exports.getPostById = async (req, res) => {
  try{
    const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Post not found' });
    res.json(rows[0]);
  }catch (error) {
    res.status(500).json({ message: 'Failed to fetch post', error: error.message });
  }
};

// POST /posts
exports.createPost = async (req, res) => {
  const { user_id, title, body } = req.body;
  if (!user_id || !title) {
    return res.status(400).json({ message: 'user_id and title are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO posts (user_id, title, body) VALUES (?, ?, ?)',
      [user_id, title, body || null]
    );

    res.status(201).json({
      id: result.insertId,
      user_id,
      title,
      body: body || null,
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /posts/:id
exports.updatePost = async (req, res) => {
  const { title, body } = req.body;
  const postId = req.params.id;

  try {
    const [result] = await db.query(
      'UPDATE posts SET title = ?, body = ? WHERE id = ?',
      [title, body, postId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Post not found' });

    res.json({ message: 'Post updated' });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /posts/:id
exports.deletePost = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Post not found' });

    res.json({ message: 'Post deleted' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
