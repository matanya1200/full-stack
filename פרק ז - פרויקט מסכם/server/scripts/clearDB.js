const db = require('../db');

async function clearDatabase() {
  try {
    // כיבוי בדיקת מפתחות זרים זמנית
    await db.query('SET FOREIGN_KEY_CHECKS = 0');

    const tables = [
      'Ranking',
      'CartItems',
      'OrderItems',
      'Orders',
      'Payment',
      'RestockRequests',
      'UserLogs',
      'Users',
      'Products',
      'Departments'
    ];

    for (const table of tables) {
      await db.query(`DELETE FROM ${table}`);
      await db.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
    }

    // הדלקת בדיקת מפתחות זרים מחדש
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('✅ Database cleared successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error clearing database:', err);
    process.exit(1);
  }
}

clearDatabase();