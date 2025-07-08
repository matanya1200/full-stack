const db = require('../db');

const autoProcessRestocks = async () => {
  try {
    const [orders] = await db.query(`
      SELECT * FROM RestockRequests
      WHERE status = 'ordered' AND TIMESTAMPDIFF(DAY, requested_at, NOW()) >= 5
    `);

    if (orders.length === 0) {
      console.log('ℹ️ No restocks to process');
      return;
    }

    // ערבוב
    const shuffled = orders.sort(() => 0.5 - Math.random());
    const total = shuffled.length;
    const rejectedCount = Math.floor(total * 0.25);
    const toReject = shuffled.slice(0, rejectedCount);
    const toArrive = shuffled.slice(rejectedCount);

    // ✅ עיבוד כל הזמנה עם פעולה לפי הסטטוס החדש
    for (const item of toArrive) {
      const { id, product_id, quantity } = item;

      // 1. עדכון למצב arrived
      await db.query(`UPDATE RestockRequests SET status = 'arrived' WHERE id = ?`, [id]);

      // 2. הוספת כמות למוצר
      await db.query(`UPDATE Products SET quantity = quantity + ? WHERE id = ?`, [quantity, product_id]);

      // 3. מחיקה
      await db.query(`DELETE FROM RestockRequests WHERE id = ?`, [id]);
    }

    for (const item of toReject) {
      const { id, product_id, quantity, requested_by } = item;

      // 1. עדכון ל־rejected
      await db.query(`UPDATE RestockRequests SET status = 'rejected' WHERE id = ?`, [id]);

      // 2. יצירת בקשה חדשה (pending)
      await db.query(
        `INSERT INTO RestockRequests (product_id, quantity, requested_by, status)
         VALUES (?, ?, ?, 'pending')`,
        [product_id, quantity, requested_by]
      );

      // 3. מחיקה של הישנה
      await db.query(`DELETE FROM RestockRequests WHERE id = ?`, [id]);
    }

    console.log(`✅ Processed ${total} restock requests: ${total - rejectedCount} arrived, ${rejectedCount} rejected`);

  } catch (err) {
    console.error('❌ Failed to process restock requests:', err.message);
  }
};

const autoUpdateOrdersToArrived = async () => {
  try {
    const [result] = await db.query(`
      UPDATE Orders
      SET status = 'arrived'
      WHERE status = 'shipped' AND TIMESTAMPDIFF(DAY, created_at, NOW()) >= 3
    `);

    if (result.affectedRows > 0) {
      console.log(`✅ Updated ${result.affectedRows} orders to 'arrived'`);
    }
  } catch (err) {
    console.error('❌ Failed to auto-update shipped orders:', err.message);
  }
};

module.exports = {
  autoUpdateOrdersToArrived,
  autoProcessRestocks
};
