const db = require('../db');
const socketManager = require('../socketManager');

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

  try {
    // בדיקה אם כבר קיים
    const [existing] = await db.query('SELECT * FROM Payment WHERE user_id = ?', [userId]);
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Payment method already exists' });
    }

    await db.query(
      `INSERT INTO Payment (user_id, card_last4, card_expiry, balance)
       VALUES (?, ?, ?, ?)`,
      [userId, card_last4, card_expiry, balance]
    );

    socketManager.notifyUser(userId, 'paymentUpdated');
    res.status(201).json({ message: 'Payment method created' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create payment method', error: err.message });
  }
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

    await db.query(
      `UPDATE Payment SET ${fields.join(', ')} WHERE user_id = ?`,
      values
    );

    socketManager.notifyUser(userId, 'paymentUpdated');
    res.json({ message: 'Payment method updated' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update payment method', error: err.message });
  }
};


// ✔️ מחיקת אמצעי תשלום
exports.deletePayment = async (req, res) => {
  const userId = parseInt(req.params.user_id);
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const [result] = await db.query('DELETE FROM Payment WHERE user_id = ?', [userId]);
    socketManager.notifyUser(userId, 'paymentUpdated');
    res.json({ message: 'Payment method deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete payment method', error: err.message });
  }
};
