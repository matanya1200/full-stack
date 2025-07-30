const db = require('../db');

class TransactionManager {
    async withTransaction(callback) {
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const result = await callback(conn);
            await conn.commit();
            return result;
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    }
}

module.exports = new TransactionManager();
