class Database {
  constructor(dbName) {
    this.dbName = dbName;
  }

  // ----- private methods -----

  #getDB() {
    const data = JSON.parse(localStorage.getItem(this.dbName));
    return Array.isArray(data) ? data : [];
  }

  #saveDB(data) {
    localStorage.setItem(this.dbName, JSON.stringify(data));
  }

  // ----- public methods -----

  searchBy(key, value) {
    const db = this.#getDB();
    return db.filter((record) => record[key].includes(value));
  }

  getAll() {
    return this.#getDB();
  }

  getById(id) {
    const db = this.#getDB();

    const item = db.find((record) => record.id === id);
    if (!item) {
      throw new Error(`Record with id ${id} not found`);
    }

    return item;
  }

  create(record) {
    const db = this.#getDB();
    db.push(record);
    this.#saveDB(db);
  }

  update(id, updatedRecord) {
    const db = this.#getDB();

    const index = db.findIndex((record) => record.id === id);
    if (index === -1) {
      throw new Error(`Record with id ${id} not found`);
    }

    db[index] = { ...db[index], ...updatedRecord };
    this.#saveDB(db);
  }

  //מחיקת משימה 
  delete(id) {
    let db = this.#getDB();

    const filteredDB = db.filter((record) => record.id != id);
    if (filteredDB.length === db.length) {
      throw new Error(`Record with id ${id} not found`);
    }

    this.#saveDB(filteredDB);
  }

  //מחיקת משתמש
  deleteUser(name) {
    let db = this.#getDB();

    const filteredDB = db.filter((record) => record.username != name);
    if (filteredDB.length === db.length) {
      throw new Error(`Record with name ${name} not found`);
    }

    this.#saveDB(filteredDB);
  }
}
