const db = require('../db');

exports.getAllRestocks = async (req, res) => {
  try {
    const [restocks] = await db.query(`
      SELECT r.*, p.name AS product_name, u.name AS requested_by_name
      FROM RestockRequests r
      JOIN Products p ON r.product_id = p.id
      JOIN Users u ON r.requested_by = u.id
    `);
    res.json(restocks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch restock requests', error: err.message });
  }
};

exports.getPendingRestocks = async (req, res) => {
  const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
  const user = users[0];
  const role = user.role;

  try {
    let query = `
      SELECT r.*, p.name AS product_name, d.name AS department_name
      FROM RestockRequests r
      JOIN Products p ON r.product_id = p.id
      JOIN Departments d ON p.department_id = d.id
      WHERE r.status = 'pending'
    `;
    const params = [];

    // אם המשתמש הוא עובד – סנן לפי המחלקה
    if (role === 'worker') {
      query += ' AND d.id = ?';
      params.push(user.department_id);
    }

    const [restocks] = await db.query(query, params);
    res.json(restocks);

  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending restock requests', error: err.message });
  }
};

exports.addRestock = async (req, res) => {
  const { product_id, quantity } = req.body;
  const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
  const user = users[0];
  const userId = user.id;
  const role = user.role;
  const departmentId = user.department_id;

  if (!product_id || !quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Missing or invalid product or quantity' });
  }

  try {
    // בדיקה אם עובד מוסיף מוצר שלא שייך למחלקה שלו
    if (role === 'worker') {
      const [products] = await db.query(
        'SELECT department_id FROM Products WHERE id = ?',
        [product_id]
      );
      if (products.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }
      const productDept = products[0].department_id;
      if (productDept !== departmentId) {
        return res.status(403).json({ message: 'Access denied: product is not in your department' });
      }
    }

    // בדיקה אם כבר יש בקשה ממתינה לאותו מוצר
    const [existing] = await db.query(
      'SELECT * FROM RestockRequests WHERE product_id = ? AND status = "pending"',
      [product_id]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Product already has a pending restock' });
    }

    // יצירת הבקשה
    await db.query(
      `INSERT INTO RestockRequests (product_id, quantity, requested_by)
       VALUES (?, ?, ?)`,
      [product_id, quantity, userId]
    );

    res.status(201).json({ message: 'Restock request created' });

  } catch (err) {
    res.status(500).json({ message: 'Failed to create restock request', error: err.message });
  }
};

exports.updateRestock = async (req, res) => {
  const id = parseInt(req.params.id);
  const { quantity, status } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM RestockRequests WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Restock not found' });
    }

    if (rows[0].status !== 'pending') {
      return res.status(400).json({ message: 'Only pending requests can be updated' });
    }

    await db.query(
      'UPDATE RestockRequests SET quantity = ?, status = ? WHERE id = ?',
      [quantity || rows[0].quantity, status || rows[0].status, id]
    );

    res.json({ message: 'Restock updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update restock', error: err.message });
  }
};

exports.deleteRestock = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const [rows] = await db.query('SELECT * FROM RestockRequests WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Restock request not found' });
    }

    const { product_id, quantity, status } = rows[0];

    if (status === 'arrived') {
      // מוסיפים למלאי
      await db.query('UPDATE Products SET quantity = quantity + ? WHERE id = ?', [quantity, product_id]);
    } else if (status === 'rejected') {
      // יוצרים מחדש את הבקשה
      await db.query(
        `INSERT INTO RestockRequests (product_id, quantity, requested_by, status)
         VALUES (?, ?, ?)`,
        [product_id, quantity, req.user.id, "pending"]
      );
    } else if (status === 'ordered') {
      return res.status(400).json({ message: 'Ordered items cannot be deleted yet' });
    }

    await db.query('DELETE FROM RestockRequests WHERE id = ?', [id]);
    res.json({ message: 'Restock processed and deleted' });

  } catch (err) {
    res.status(500).json({ message: 'Failed to process restock deletion', error: err.message });
  }
};
