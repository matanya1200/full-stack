const db = require('../db');
const socketManager = require('../socketManager');
const transactionManager = require('../utils/transactionManager');
const transactionHTTPError = require('../utils/transactionHTTPError');

// ✔️ קבלת אמצעי התשלום של המשתמש
exports.getPayment = async (req, res) => {
  const userId = parseInt(req.params.user_id);
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const [payments] = await db.query('SELECT * FROM Payment WHERE user_id = ?', [userId]);
    if (payments.length === 0) {
      return res.status(404).json({ message: 'No payment method found' });
    }

    res.json(payments[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payment method', error: err.message });
  }
};

// ✔️ יצירת אמצעי תשלום
exports.createPayment = async (req, res) => {
  const userId = req.user.id;
  const { card_last4, card_expiry, balance } = req.body;

  if (!card_last4 || !card_expiry || balance == null) {
    return res.status(400).json({ message: 'Missing card details or balance' });
  }

  await transactionManager.withTransaction(async (conn) => {
    try {
      // בדיקה אם כבר קיים
      const [existing] = await conn.query('SELECT * FROM Payment WHERE user_id = ?', [userId]);
      if (existing.length > 0) {
        throw new transactionHTTPError(409, 'Payment method already exists');
      }

      await conn.query(
        `INSERT INTO Payment (user_id, card_last4, card_expiry, balance)
         VALUES (?, ?, ?, ?)`,
        [userId, card_last4, card_expiry, balance]
      );

      socketManager.notifyUser(userId, 'paymentUpdated');
      throw new transactionHTTPError(201, 'Payment method created');
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Failed to create payment method', error: err.message });
      }
    }
  });
};

// ✔️ עדכון יתרה / תוקף
exports.updatePayment = async (req, res) => {
  const userId = parseInt(req.params.user_id);
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const { balance, card_expiry } = req.body;

  if (balance == null && !card_expiry) {
    return res.status(400).json({ message: 'Nothing to update' });
  }

  await transactionManager.withTransaction(async (conn) => {
    try {
      const fields = [];
      const values = [];

      if (balance != null) {
        fields.push('balance = ?');
        values.push(balance);
      }

      if (card_expiry) {
        fields.push('card_expiry = ?');
        values.push(card_expiry);
      }

      values.push(userId);

      await conn.query(
        `UPDATE Payment SET ${fields.join(', ')} WHERE user_id = ?`,
        values
      );

      socketManager.notifyUser(userId, 'paymentUpdated');
      throw new transactionHTTPError(200, 'Payment method updated');
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Failed to update payment method', error: err.message });
      }
    }
  });
};


// ✔️ מחיקת אמצעי תשלום
exports.deletePayment = async (req, res) => {
  const userId = parseInt(req.params.user_id);
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  await transactionManager.withTransaction(async (conn) => {
    try {
      await conn.query('DELETE FROM Payment WHERE user_id = ?', [userId]);
      socketManager.notifyUser(userId, 'paymentUpdated');
      throw new transactionHTTPError(200, 'Payment method deleted');
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Failed to delete payment method', error: err.message });
      }
    }
  });
};
