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

  #getFilterFunction(record, { field, operator, value }) {
    switch (operator) {
      case "equals":
        return record[field] === value;
      case "contains":
        return record[field].includes(value);
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }

  // ----- public methods -----

  getAll(query) {
    let db = this.#getDB();

    if (query) {
      db = db.filter((record) => {
        if (query.conector === "or") {
          return query.filters.some((filter) =>
            this.#getFilterFunction(record, filter)
          );
        }
        return query.filters.every((filter) =>
          this.#getFilterFunction(record, filter)
        );
      });
    }

    return db;
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

  delete(id) {
    let db = this.#getDB();

    const filteredDB = db.filter((record) => record.id != id);
    if (filteredDB.length === db.length) {
      throw new Error(`Record with id ${id} not found`);
    }

    this.#saveDB(filteredDB);
  }
}
