const db = require('../db');
const { logActivity } = require('../utils/logger');
const { getUserDiscount } = require('../utils/discountUtils');

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

  const connection = await db.getConnection(); // שימוש בטרנזאקציה
  try {
    await connection.beginTransaction();

    [addressResult] = await connection.query('SELECT address FROM Users WHERE id = ?', [userId]);
    const address = addressResult[0]?.address || '';

    // 1. בדיקה אם יש אמצעי תשלום
    const [payments] = await connection.query('SELECT * FROM Payment WHERE user_id = ?', [userId]);
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
    const [cartItems] = await connection.query(
      `SELECT ci.*, p.price, p.quantity AS stock, p.min_quantity, p.name 
       FROM CartItems ci
       JOIN Products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // 3. סכימת מחיר כולל
    const totalPrice = cartItems.reduce((sum, item) => {
      const discountedPrice = item.price * discount;
      return sum + discountedPrice * item.quantity;
    }, 0);

    // 4. בדיקת יתרה
    if (paymentMethod.balance < totalPrice) {
      return res.status(402).json({ message: 'Insufficient balance. Please recharge your payment method.' });
    }

    // 5. הורדת הסכום מהיתרה
    await connection.query(
      'UPDATE Payment SET balance = balance - ? WHERE id = ?',
      [totalPrice, paymentMethod.id]
    );

    // 6. יצירת הזמנה חדשה
    const [orderResult] = await connection.query(
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

    await connection.query(
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

    await connection.query(
      `UPDATE Products
         SET quantity = CASE ${cases} END
       WHERE id IN (${ids})`
    );

    // 9. בדיקת חידוש מלאי
    await connection.query(
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

    /*// 7. העברת כל הפריטים ל־OrderItems
    for (const item of cartItems) {
      await connection.query(
        `INSERT INTO OrderItems (order_id, product_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price * discount]
      );

      // 8. הפחתת מלאי מהמוצר
      await connection.query(
        'UPDATE Products SET quantity = quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );

      // 9. בדיקת חידוש מלאי
      const remainingQty = item.stock - item.quantity;
      if (remainingQty <= item.min_quantity) {
        await connection.query(
          `INSERT INTO RestockRequests (product_id, quantity, requested_by, status)
           VALUES (?, ?, 1, 'pending')`,
          [item.product_id, item.min_quantity * 2] // כמות לחידוש לדוגמה
        );
      }
    }*/

    // 10. ניקוי סל הקניות
    await connection.query('DELETE FROM CartItems WHERE user_id = ?', [userId]);

    // 11. תיעוד ביומן
    await logActivity(userId, `Order placed (order_id: ${orderId}, total: $${totalPrice})`);

    // 12. שינוי סטטוס ל-'arrived' אחרי 3 ימים
    setTimeout(async () => {
      try {
        const innerConn = await db.getConnection();
        await innerConn.query(
          "UPDATE Orders SET status = 'arrived' WHERE id = ?",
          [orderId]
        );
        innerConn.release();
      } catch (err) {
        console.error('Failed to update order to arrived:', err.message);
      }
    }, 3 * 24 * 60 * 60 * 1000); // 3 ימים במילישניות

    await connection.commit();
    connection.release();

    res.status(201).json({
      message: 'Order placed successfully',
      order_id: orderId,
      total: totalPrice,
      address
    });

  } catch (err) {
    await connection.rollback();
    connection.release();
    console.error(err);
    res.status(500).json({ message: 'Purchase failed', error: err.message });
  }
};

