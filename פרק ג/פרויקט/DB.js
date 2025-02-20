class Database {
    static getDB(dbName) {
        //return JSON.parse(localStorage.getItem(dbName)) || [];
        const data = JSON.parse(localStorage.getItem(dbName));
        return Array.isArray(data) ? data : []; // ✅ החזרת מערך תמיד
    }

    static saveDB(dbName, data) {
        console.log(`💾 Saving to ${dbName}:`, data); // 🔍 בדיקה
        localStorage.setItem(dbName, JSON.stringify(data));
    }

    static getAll(dbName) {
        return this.getDB(dbName);
    }

    static getById(dbName, id) {
        const db = this.getDB(dbName);
        return db.find(record => record.id === id) || null;
    }

    static create(dbName, record) {
        const db = this.getDB(dbName);

        console.log(`📂 Before adding to ${dbName}:`, db); // 🔍 בדיקה

        db.push(record);
        this.saveDB(dbName, db);

        console.log(`📂 After adding to ${dbName}:`, this.getDB(dbName)); // 🔍 בדיקה
    }

    static update(dbName, id, updatedRecord) {
        const db = this.getDB(dbName);
        const index = db.findIndex(record => record.id === id);
        if (index !== -1) {
            db[index] = { ...db[index], ...updatedRecord };
            this.saveDB(dbName, db);
        }
    }

    static delete(dbName, id) {
        const db = this.getDB(dbName);
        const updatedDB = db.filter(record => record.id !== id);
        this.saveDB(dbName, updatedDB);
    }
}
