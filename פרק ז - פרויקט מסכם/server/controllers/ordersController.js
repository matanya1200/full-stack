const db = require('../db');
const { logActivity } = require('../utils/logger');
const { getUserDiscount } = require('../utils/discountUtils');
const socketManager = require('../utils/socketManager');
const transactionManager = require('../utils/transactionManager');
const transactionHTTPError = require('../utils/transactionHTTPError');

// ✔️ כל ההזמנות (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.query(`
      SELECT o.*, u.name AS user_name
      FROM Orders o
      JOIN Users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get orders', error: err.message });
  }
};

// ✔️ כל ההזמנות של משתמש
exports.getOrdersByUser = async (req, res) => {
  const userId = parseInt(req.params.user_id);
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const [orders] = await db.query('SELECT * FROM Orders WHERE user_id = ?', [userId]);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user orders', error: err.message });
  }
};

// ✔️ כל הפריטים בכל ההזמנות (admin)
exports.getAllOrderItems = async (req, res) => {
  try {
    const [items] = await db.query(`
      SELECT oi.*, o.user_id, p.name AS product_name
      FROM OrderItems oi
      JOIN Orders o ON oi.order_id = o.id
      JOIN Products p ON oi.product_id = p.id
    `);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get order items', error: err.message });
  }
};

// ✔️ כל הפריטים של משתמש
exports.getOrdersItemsByUser = async (req, res) => {
  const userId = parseInt(req.params.user_id);
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const [items] = await db.query(`
      SELECT oi.*, p.name AS product_name
      FROM OrderItems oi
      JOIN Orders o ON oi.order_id = o.id
      JOIN Products p ON oi.product_id = p.id
      WHERE o.user_id = ?
    `, [userId]);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user order items', error: err.message });
  }
};

// ✔️ כל הפריטים של משתמש
exports.getOrderItemsByUser = async (req, res) => {
  const userId = parseInt(req.params.user_id);
  const orderID = parseInt(req.params.order_id);
  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const [items] = await db.query(`
      SELECT oi.*, p.name AS product_name
      FROM OrderItems oi
      JOIN Orders o ON oi.order_id = o.id
      JOIN Products p ON oi.product_id = p.id
      WHERE oi.order_id = ? AND o.user_id = ?
    `, [orderID, userId]);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user order items', error: err.message });
  }
};

exports.buy = async (req, res) => {
  const userId = req.user.id;
  const discount = getUserDiscount(req.user.role);

  await transactionManager.withTransaction(async (conn) => {
    try {
      [addressResult] = await conn.query('SELECT address FROM Users WHERE id = ?', [userId]);
      const address = addressResult[0]?.address || '';
      
      // 1. בדיקה אם יש אמצעי תשלום
      const [payments] = await conn.query('SELECT * FROM Payment WHERE user_id = ?', [userId]);
      let paymentMethod;
      if (payments.length === 0) {
        return res.status(400).json({
          message: 'No payment method found',
          details: 'Please add a payment method before making a purchase.'
        });
      } else {
        paymentMethod = payments[0];
      }
      
      // 2. קבלת פריטי סל הקניות
      const [cartItems] = await conn.query(
      `SELECT ci.*, p.price, p.quantity AS stock, p.min_quantity, p.name 
      FROM CartItems ci
      JOIN Products p ON ci.product_id = p.id
      WHERE ci.user_id = ?`,
      [userId]
      );

      if (cartItems.length === 0) {
        throw new transactionHTTPError(400, 'Cart is empty');
      }

      // 3. סכימת מחיר כולל
      const totalPrice = cartItems.reduce((sum, item) => {
        const discountedPrice = item.price * discount;
        return sum + discountedPrice * item.quantity;
      }, 0);

      // 4. בדיקת יתרה
      if (paymentMethod.balance < totalPrice) {
        throw new transactionHTTPError(402, 'Insufficient balance. Please recharge your payment method.');
      }

      // 5. הורדת הסכום מהיתרה
      await conn.query(
        'UPDATE Payment SET balance = balance - ? WHERE id = ?',
        [totalPrice, paymentMethod.id]
      );

      // 6. יצירת הזמנה חדשה
      const [orderResult] = await conn.query(
        `INSERT INTO Orders (user_id, total_price, status, address)
        VALUES (?, ?, 'shipped', ?)`,
        [userId, totalPrice, address]
      );

      const orderId = orderResult.insertId;

      // 7. העברת כל הפריטים ל־OrderItems
      const orderItemsValues = cartItems.map(item => [
        orderId,
        item.product_id,
        item.quantity,
        item.price * discount
      ]);

      await conn.query(
        `INSERT INTO OrderItems (order_id, product_id, quantity, price)
        VALUES ?`, // note the single placeholder for bulk insert
        [orderItemsValues]
      );

      // 8. הפחתת מלאי מהמוצר
      // Build a map of product_id → quantityToSubtract
      const qtyMap = cartItems.reduce((m, item) => {
        m[item.product_id] = item.quantity;
        return m;
      }, {});

      const cases = Object.entries(qtyMap)
      .map(([id, qty]) => `WHEN id = ${id} THEN quantity - ${qty}`)
      .join(' ');

      const ids = Object.keys(qtyMap).join(',');

      await conn.query(
        `UPDATE Products
        SET quantity = CASE ${cases} END
        WHERE id IN (${ids})`
      );

      // 9. בדיקת חידוש מלאי
      await conn.query(
        `INSERT INTO RestockRequests (product_id, quantity, requested_by, status)
        SELECT
        ci.product_id,
        p.min_quantity * 2 AS quantity,
        1 AS requested_by,
        'pending' AS status
        FROM CartItems ci
        JOIN Products p ON ci.product_id = p.id
        WHERE ci.user_id = ?
        AND (p.quantity - ci.quantity) <= p.min_quantity;`,
        [userId]
      );

      // 10. ניקוי סל הקניות
      await conn.query('DELETE FROM CartItems WHERE user_id = ?', [userId]);

      // 11. תיעוד ביומן
      await logActivity(userId, `Order placed (order_id: ${orderId}, total: $${totalPrice})`);

      // 12. שינוי סטטוס ל-'arrived' אחרי 3 ימים
      setTimeout(async () => {
        try {
          await db.query(
            "UPDATE Orders SET status = 'arrived' WHERE id = ?",
            [orderId]
          );
        } catch (err) {
          console.error('Failed to update order to arrived:', err.message);
        }
      }, 3 * 24 * 60 * 60 * 1000); // 3 ימים במילישניות

      if (socketManager?.notifyUser) {
        socketManager.notifyUser(userId, 'cartUpdated');
        socketManager.notifyUser(userId, 'orderUpdated');
        socketManager.notifyUser(userId, 'paymentUpdated');
      }

      throw new transactionHTTPError(201, 'Order placed successfully', {
        order_id: orderId,
        total: totalPrice,
        address
      });

    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message, ...err.data });
      } else {
        res.status(500).json({ message: 'Purchase failed', error: err.message });
      }
    }
  }); 
};

