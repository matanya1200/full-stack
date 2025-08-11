// controllers/departmentsController.js
const db = require('../db');
const socketManager = require('../socketManager');
const transactionManager = require('../utils/transactionManager');
const transactionHTTPError = require('../utils/transactionHTTPError');

// ✔️ הוספת מחלקה
exports.createDepartment = async (req, res) => {
  await transactionManager.withTransaction(async (conn) => {
    try {
      const { name } = req.body;

      if (!name) {
        throw new transactionHTTPError(400, 'Department name is required');
      }

      const [existing] = await conn.query('SELECT * FROM Departments WHERE name = ?', [name]);
      if (existing.length > 0) {
        throw new transactionHTTPError(409, 'Department already exists');
      }

      await conn.query('INSERT INTO Departments (name) VALUES (?)', [name]);
      socketManager.broadcast('departmentUpdate');
      throw new transactionHTTPError(201, 'Department created');
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Failed to create department', error: err.message });
      }
    }
  });
};

// ✔️ מחיקת מחלקה + הפיכת עובדיה לעובדים כלליים (department_id = NULL)
exports.deleteDepartment = async (req, res) => {
  await transactionManager.withTransaction(async (conn) => {
    try {
      const id = parseInt(req.params.id);

      // בדיקה אם קיימים מוצרים פעילים במחלקה
      const [products] = await conn.query(
        'SELECT COUNT(*) AS count FROM Products WHERE department_id = ? AND quantity > 0',
        [id]
      );

      if (products[0].count > 0) {
        throw new transactionHTTPError(409, 'Cannot delete department with existing products in stock');
      }

      // ננטרל את המחלקה מהעובדים
      await conn.query('UPDATE Users SET department_id = NULL WHERE department_id = ?', [id]);

      // נמחק את המחלקה עצמה
      const [result] = await conn.query('DELETE FROM Departments WHERE id = ?', [id]);

      if (result.affectedRows === 0) {
        throw new transactionHTTPError(404, 'Department not found');
      }

      socketManager.broadcast('departmentUpdate');
      throw new transactionHTTPError(200, 'Department deleted and workers updated');
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Failed to delete department', error: err.message });
      }
    }
  });
};


// ✔️ קבלת כל המחלקות (לכולם)
exports.getAllDepartments = async (req, res) => {
  try {
    const [departments] = await db.query('SELECT * FROM Departments');
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch departments', error: err.message });
  }
};

