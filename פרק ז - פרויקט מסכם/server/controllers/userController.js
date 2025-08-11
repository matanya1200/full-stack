// controllers/userController.js
const db = require('../db');
const { logActivity } = require('../utils/logger');
const socketManager = require('../socketManager');
const transactionManager = require('../utils/transactionManager');
const transactionHTTPError = require('../utils/transactionHTTPError');

// ✔️ קבלת כל המשתמשים – למנהל
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, is_blocked, department_id FROM Users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// ✔️ קבלת משתמש לפי ID
exports.getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  const isSelf = req.user.id === id;
  const isAdmin = req.user.role === 'admin';

  if (!isSelf && !isAdmin) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const [users] = await db.query('SELECT id, name, email, role, is_blocked, department_id, address FROM Users WHERE id = ?', [id]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

// ✔️ עדכון פרטים אישיים – על ידי המשתמש עצמו
exports.updateUser = async (req, res) => {
  const id = parseInt(req.params.id);
  if (req.user.id !== id) {
    return res.status(403).json({ message: 'You can only update your own profile' });
  }

  const { name, address } = req.body;

  await transactionManager.withTransaction(async (conn) => {
    try {
      const fields = [];
      const values = [];

      if (name !== undefined) {
        fields.push('name = ?');
        values.push(name);
      }
      if (address !== undefined) {
        fields.push('address = ?');
        values.push(address);
      }

      if (fields.length === 0) {
        throw new transactionHTTPError(400, 'Nothing to update');
      }

      fields.push('updated_at = NOW()');
      values.push(id);

      await conn.query(`UPDATE Users SET ${fields.join(', ')} WHERE id = ?`, values);

      socketManager.notifyUser(id, 'userUpdated');
      await logActivity(req.user.id, 'Updated profile', conn);
      throw new transactionHTTPError(200, 'User updated successfully');
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Update failed', error: err.message });
      }
    }
  });
};

// ✔️ עדכון תפקיד ומחלקה – על ידי מנהל
exports.updateUserRole = async (req, res) => {
  const id = parseInt(req.params.id);

  await transactionManager.withTransaction(async (conn) => {
    try {
      const [users] = await conn.query('SELECT role FROM Users WHERE id = ?', [id]);
      if (users.length === 0) {
        throw new transactionHTTPError(404, 'User not found');
      }

      const { role, department_id } = req.body;

      if (req.user.id === id || users[0].role === "admin") {
        throw new transactionHTTPError(403, 'Admin cannot change their own role or other admin');
      }

      if(role === "worker" && (department_id === null || department_id === undefined)){
        throw new transactionHTTPError(402, 'missing department');
      }
      await conn.query('UPDATE Users SET role = ?, department_id = ? WHERE id = ?', [role, department_id || null, id]);
      await logActivity(req.user.id, `Changed role of user ${id} to ${role}`, conn);
      throw new transactionHTTPError(200, 'User role updated');
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Role update failed', error: err.message });
      }
    }
  });
};

// ✔️ חסימת משתמש – ע"י מנהל
exports.blockUser = async (req, res) => {
  const id = parseInt(req.params.id);
  const { block } = req.body;

  await transactionManager.withTransaction(async (conn) => {
    try {
      const [users] = await conn.query('SELECT role FROM Users WHERE id = ?', [id]);
      if (users.length === 0) {
        throw new transactionHTTPError(404, 'User not found');
      }

      if (req.user.id === id || users[0].role === "admin") {
        throw new transactionHTTPError(403, 'Cannot block yourself or other admin');
      }

      await conn.query('UPDATE Users SET is_blocked = ? WHERE id = ?', [block, id]);
      const statusText = block ? 'blocked' : 'unblocked';
      await logActivity(req.user.id, `${statusText} user ${id}`, conn);
      throw new transactionHTTPError(200, `User ${statusText} successfully`);
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Block failed', error: err.message });
      }
    }
  });
};

// ✔️ מחיקת משתמש – ע"י עצמו בלבד
exports.deleteUser = async (req, res) => {
  const id = parseInt(req.params.id);
  if (req.user.id !== id) {
    return res.status(403).json({ message: 'You can only delete your own account' });
  }

  await transactionManager.withTransaction(async (conn) => {
    try {
      await conn.query('DELETE FROM Users WHERE id = ?', [id]);
      socketManager.notifyUser(id, 'userUpdated');
      await logActivity(req.user.id, 'Deleted own account', conn);
      throw new transactionHTTPError(200, 'User deleted');
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Delete failed', error: err.message });
      }
    }
  });
};
