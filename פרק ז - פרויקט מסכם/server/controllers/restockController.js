const db = require('../db');
const socketManager = require('../socketManager');
const transactionManager = require('../utils/transactionManager');
const transactionHTTPError = require('../utils/transactionHTTPError');

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
  await transactionManager.withTransaction(async (conn) => {
    try {
      const [users] = await conn.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
      const user = users[0];
      const role = user.role;

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

      const [restocks] = await conn.query(query, params);
      throw new transactionHTTPError(200, 'Fetched pending restocks', restocks);
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message, data: err.data });
      } else {
        res.status(500).json({ message: 'Failed to fetch pending restock requests', error: err.message });
      }
    }
  });
};

exports.addRestock = async (req, res) => {
  await transactionManager.withTransaction(async (conn) => {
    try {
      const { product_id, quantity } = req.body;
      const [users] = await conn.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
      const user = users[0];
      const userId = user.id;
      const role = user.role;
      const departmentId = user.department_id;

      if (!product_id || !quantity || quantity <= 0) {
        throw new transactionHTTPError(400, 'Missing or invalid product or quantity');
      }

      // בדיקה אם עובד מוסיף מוצר שלא שייך למחלקה שלו
      if (role === 'worker') {
        const [products] = await conn.query(
          'SELECT department_id FROM Products WHERE id = ?',
          [product_id]
        );
        if (products.length === 0) {
          throw new transactionHTTPError(404, 'Product not found');
        }
        const productDept = products[0].department_id;
        if (productDept !== departmentId) {
          throw new transactionHTTPError(403, 'Access denied: product is not in your department');
        }
      }

      // בדיקה אם כבר יש בקשה ממתינה לאותו מוצר
      const [existing] = await conn.query(
        'SELECT * FROM RestockRequests WHERE product_id = ? AND status = "pending"',
        [product_id]
      );
      if (existing.length > 0) {
        throw new transactionHTTPError(409, 'Product already has a pending restock');
      }

      // יצירת הבקשה
      await conn.query(
        `INSERT INTO RestockRequests (product_id, quantity, requested_by)
         VALUES (?, ?, ?)`,
        [product_id, quantity, userId]
      );

      socketManager.notifyUser(1, 'restockUpdated'); // inform admin
      throw new transactionHTTPError(201, 'Restock request created');
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Failed to create restock request', error: err.message });
      }
    }
  });
};

exports.updateRestock = async (req, res) => {
  await transactionManager.withTransaction(async (conn) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity, status } = req.body;

      const [rows] = await conn.query('SELECT * FROM RestockRequests WHERE id = ?', [id]);

      if (rows.length === 0) {
        throw new transactionHTTPError(404, 'Restock not found');
      }

      if (rows[0].status !== 'pending') {
        throw new transactionHTTPError(400, 'Only pending requests can be updated');
      }

      await conn.query(
        'UPDATE RestockRequests SET quantity = ?, status = ? WHERE id = ?',
        [quantity || rows[0].quantity, status || rows[0].status, id]
      );

      socketManager.notifyUser(1, 'restockUpdated'); // inform admin
      throw new transactionHTTPError(200, 'Restock updated');
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Failed to update restock', error: err.message });
      }
    }
  });
};

exports.deleteRestock = async (req, res) => {
  await transactionManager.withTransaction(async (conn) => {
    try {
      const id = parseInt(req.params.id);

      const [rows] = await conn.query('SELECT * FROM RestockRequests WHERE id = ?', [id]);

      if (rows.length === 0) {
        throw new transactionHTTPError(404, 'Restock request not found');
      }

      const { product_id, quantity, status } = rows[0];

      if (status === 'arrived') {
        // מוסיפים למלאי
        await conn.query('UPDATE Products SET quantity = quantity + ? WHERE id = ?', [quantity, product_id]);
      } else if (status === 'rejected') {
        // יוצרים מחדש את הבקשה
        await conn.query(
          `INSERT INTO RestockRequests (product_id, quantity, requested_by, status)
           VALUES (?, ?, ?, ?)`,
          [product_id, quantity, req.user.id, "pending"]
        );
      } else if (status === 'ordered') {
        throw new transactionHTTPError(400, 'Ordered items cannot be deleted yet');
      }

      await conn.query('DELETE FROM RestockRequests WHERE id = ?', [id]);
      socketManager.notifyUser(1, 'restockUpdated'); // inform admin
      throw new transactionHTTPError(200, 'Restock processed and deleted');
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Failed to process restock deletion', error: err.message });
      }
    }
  });
};
