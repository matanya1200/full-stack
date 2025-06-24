const db = require('../db');

// GET /photos?albumId=:albumid&page=:page 
// GET /albums/:albumid/photos?page=:page 
exports.getPhotosByAlbume = async (req, res) => {
  const albumId = req.query.albumId || req.params.albumId;
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  try {
    let query = 'SELECT * FROM photos';
    const params = [];

    if (albumId) {
      query += ' WHERE album_id = ?';
      params.push(albumId);
    }

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(query, params);

    if (rows.length === 0 && page === 1) {
      return res.status(404).json({ message: 'Album not found or empty' });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// GET /albums/:albumId/photos/:photoid
exports.getPhotoById = async (req, res) => {
  const { albumId, photoId } = req.params;

  try {
    const [rows] = await db.query(
      'SELECT * FROM photos WHERE id = ? AND album_id = ?',
      [photoId, albumId]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'photo not found' });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// POST /albums/:albumId/photos
exports.createPhoto = async (req, res) => {
  const albumId = req.params.albumId;
  const { title, url } = req.body;

  if (!title || !url) {
    return res.status(400).json({ message: 'חסרים שדות' });
  }

  let thumbnailUrl = url;

  try {
    const [result] = await db.query(
      'INSERT INTO photos (album_id, title, url, thumbnailUrl) VALUES (?, ?, ?, ?)',
      [albumId, title, url, thumbnailUrl]
    );

    res.status(201).json({
      id: result.insertId,
      album_id: albumId,
      title,
      url,
      thumbnailUrl,
    });
  } catch (error) {
    console.error('Error creating photo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// PUT /albums/:albumId/photos/:photoid
exports.updatePhoto = async (req, res) => {
  const { albumId, photoId } = req.params;
  const { title, url } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM photos WHERE id = ?', [req.params.photoId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'photo not found' });
    }
    const existingUser = rows[0];

     // אם שדה לא נשלח – שומרים את הערך הקיים
    const updatedtitle = title ?? existingUser.title;
    const updatedUserurl = url ?? existingUser.url;
    
    const [result] = await db.query(
      'UPDATE photos SET title = ?, url = ?, thumbnailUrl = ? WHERE id = ? AND album_id = ?',
      [title, updatedUserurl, updatedUserurl, photoId, albumId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'photo not found' });

    res.status(200).json({ message: 'photo updated' });
  } catch (error) {
    console.error('Error updating photo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE /albums/:albumId/photos/:photoid
exports.deletePhoto = async (req, res) => {
  const { albumId, photoId } = req.params;

  try {
    const [result] = await db.query(
      'DELETE FROM photos WHERE id = ? AND album_id = ?',
      [photoId, albumId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'photo not found' });

    res.status(200).json({ message: 'photo deleted' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
