// controllers/departmentsController.js
const db = require('../db');
const socketManager = require('../socketManager');

// ✔️ הוספת מחלקה
exports.createDepartment = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Department name is required' });
  }

  try {
    const [existing] = await db.query('SELECT * FROM Departments WHERE name = ?', [name]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Department already exists' });
    }

    await db.query('INSERT INTO Departments (name) VALUES (?)', [name]);
    socketManager.broadcast('departmentUpdate');
    res.status(201).json({ message: 'Department created' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create department', error: err.message });
  }
};

// ✔️ מחיקת מחלקה + הפיכת עובדיה לעובדים כלליים (department_id = NULL)
exports.deleteDepartment = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    // בדיקה אם קיימים מוצרים פעילים במחלקה
    const [products] = await db.query(
      'SELECT COUNT(*) AS count FROM Products WHERE department_id = ? AND quantity > 0',
      [id]
    );

    if (products[0].count > 0) {
      return res.status(409).json({ message: 'Cannot delete department with existing products in stock' });
    }

    // ננטרל את המחלקה מהעובדים
    await db.query('UPDATE Users SET department_id = NULL WHERE department_id = ?', [id]);

    // נמחק את המחלקה עצמה
    const [result] = await db.query('DELETE FROM Departments WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }

    socketManager.broadcast('departmentUpdate');
    res.json({ message: 'Department deleted and workers updated' });

  } catch (err) {
    res.status(500).json({ message: 'Failed to delete department', error: err.message });
  }
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

