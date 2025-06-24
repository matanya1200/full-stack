const db = require('../db');

// GET /albums
exports.getAllAlbums = async (req, res) => {
  try {
    const { user_id } = req.query;

    let query = `
      SELECT albums.*, users.name AS user_name
      FROM albums
      JOIN users ON albums.user_id = users.id
    `;
    const params = [];

    if (user_id) {
      query += ' WHERE albums.user_id = ?';
      params.push(user_id);
    }

    const [rows] = await db.query(query, params);
    res.json(rows);

  } catch (error) {
    console.error('Error fetching album:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// GET /albums/:id
exports.getAlbumById = async (req, res) => {
  try{
    const [rows] = await db.query('SELECT * FROM albums WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'album not found' });
    res.json(rows[0]);
  }catch (error) {
    res.status(500).json({ message: 'Failed to fetch album', error: error.message });
  }
};

// POST /albums
exports.createAlbum = async (req, res) => {
  const { user_id, title } = req.body;
  if (!user_id || !title) {
    return res.status(400).json({ message: 'user_id and title are required' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO albums (user_id, title) VALUES (?, ?)',
      [user_id, title]
    );

    res.status(201).json({
      id: result.insertId,
      user_id,
      title,
    });
  } catch (error) {
    console.error('Error creating album:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /albums/:id
exports.updateAlbum = async (req, res) => {
  const { title } = req.body;
  const postId = req.params.id;

  try {
    const [result] = await db.query(
      'UPDATE albums SET title = ? WHERE id = ?',
      [title, postId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'album not found' });

    res.json({ message: 'album updated' });
  } catch (error) {
    console.error('Error updating album:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /albums/:id
exports.deleteAlbum = async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM albums WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'album not found' });

    res.json({ message: 'album deleted' });
  } catch (error) {
    console.error('Error deleting album:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
