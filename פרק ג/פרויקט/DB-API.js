class Database {
  constructor(dbName) {
    this.dbName = dbName;
  }

  // ----- private methods -----

  //קבלת בסיס הנתונים
  #getDB() {
    const data = JSON.parse(localStorage.getItem(this.dbName));
    return Array.isArray(data) ? data : [];
  }

  //שמירת בסיס הנתונים
  #saveDB(data) {
    localStorage.setItem(this.dbName, JSON.stringify(data));
  }

  // ----- public methods -----

  //קבלת כל המשימות
  getAll() {
    return this.#getDB();
  }

  //קבלת משימה
  getById(id) {
    const db = this.#getDB();

    const item = db.find((record) => record.id === id);
    if (!item) {
      throw new Error(`Record with id ${id} not found`);
    }

    return item;
  }

  //יצירה
  create(record) {
    const db = this.#getDB();
    db.push(record);
    this.#saveDB(db);
  }

  //עדכון
  update(id, updatedRecord) {
    const db = this.#getDB();

    const index = db.findIndex((record) => record.id === id);
    if (index === -1) {
      throw new Error(`Record with id ${id} not found`);
    }

    db[index] = { ...db[index], ...updatedRecord };
    this.#saveDB(db);
  }

  //מחיקה 
  delete(id) {
    let db = this.#getDB();

    const filteredDB = db.filter((record) => record.id != id);
    if (filteredDB.length === db.length) {
      throw new Error(`Record with id ${id} not found`);
    }

    this.#saveDB(filteredDB);
  }
}
