// controllers/productsController.js
const db = require('../db');
const { getUserDiscount } = require('../utils/discountUtils');
const socketManager = require('../socketManager');
const transactionManager = require('../utils/transactionManager');
const transactionHTTPError = require('../utils/transactionHTTPError');

// ✔️ קבלת כל המוצרים עם עימוד
exports.getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const discount = getUserDiscount(req.user.role);

  try {
    const [products] = await db.query(
      `SELECT id, name, description, quantity, min_quantity, department_id, image,
              price * ? AS discounted_price
       FROM Products
       LIMIT ? OFFSET ?`,
      [discount, limit, offset]
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

exports.getAllProductsWithoutPage = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const discount = getUserDiscount(req.user.role);

  try {
    const [products] = await db.query(
      `SELECT id, name, description, quantity, min_quantity, department_id, image,
              price * ? AS discounted_price
       FROM Products`,
      [discount]
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
};

// ✔️ קבלת מוצרים לפי מחלקה
exports.getByDepartment = async (req, res) => {
  const departmentId = parseInt(req.params.id);
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const discount = getUserDiscount(req.user.role);

  try {
    const [products] = await db.query(
      `SELECT id, name, description, quantity, min_quantity, department_id, image,
              price * ? AS discounted_price 
       FROM Products WHERE department_id = ? LIMIT ? OFFSET ?`,
      [discount, departmentId, limit, offset]
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products by department', error: err.message });
  }
};


// ✔️ חיפוש עם סינון לפי שם
exports.searchProducts = async (req, res) => {
  const search = req.query.search;
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const discount = getUserDiscount(req.user.role);

  try {
    const [products] = await db.query(
      `SELECT id, name, description, quantity, min_quantity, department_id, image,
              price * ? AS discounted_price
       FROM Products WHERE name LIKE ? LIMIT ? OFFSET ?`,
      [discount, `%${search}%`, limit, offset]
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};

// ✔️ חיפוש במחלקה עם סינון לפי שם
exports.searchProductsInDepartment = async (req, res) => {
  const search = req.query.search;
  const departmentId = parseInt(req.query.department);
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const discount = getUserDiscount(req.user.role);

  try {
    const [products] = await db.query(
      `SELECT id, name, description, quantity, min_quantity, department_id, image,
              price * ? AS discounted_price
       FROM Products WHERE department_id = ? AND name LIKE ? LIMIT ? OFFSET ?`,
      [discount, departmentId, `%${search}%`, limit, offset]
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Search in department failed', error: err.message });
  }
};

// ✔️ קבלת מוצר לפי id
exports.getProductById = async (req, res) => {
  const id = parseInt(req.params.id);
  const discount = getUserDiscount(req.user.role);
  try {
    const [products] = await db.query(`SELECT id, name, description, quantity, min_quantity, department_id, image,
               price * ? AS discounted_price
               FROM Products WHERE id = ?`, [discount, id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(products[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get product', error: err.message });
  }
};

// ✔️ יצירת מוצר (מנהל בלבד)
exports.createProduct = async (req, res) => {
  await transactionManager.withTransaction(async (conn) => {
    try {
      const { name, description, price, quantity, min_quantity, department_id, image } = req.body;

      if (!image.startsWith('data:image/')) {
        throw new transactionHTTPError(400, 'Invalid image format');
      }

      await conn.query(
        `INSERT INTO Products (name, description, price, quantity, min_quantity, department_id, image)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, description, price, quantity, min_quantity, department_id, image]
      );

      socketManager.broadcast('productUpdated');
      throw new transactionHTTPError(201, 'Product created');
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Failed to create product', error: err.message });
      }
    }
  });
};

exports.updateProduct = async (req, res) => {
  await transactionManager.withTransaction(async (conn) => {
    try {
      const id = parseInt(req.params.id);
      const { name, description, price, min_quantity, image } = req.body;

      const [products] = await conn.query('SELECT * FROM Products WHERE id = ?', [id]);
      const [users] = await conn.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
      if (products.length === 0) {
        throw new transactionHTTPError(404, 'Product not found');
      }

      const product = products[0];
      const user = users[0];

      const isAdmin = user.role === 'admin';
      const isWorker = user.role === 'worker' && user.department_id === product.department_id;

      if (!isAdmin && !isWorker) {
        throw new transactionHTTPError(403, 'No permission to update this product');
      }

      // בונים דינמית את השדות לעדכון
      const updatedFields = {
        name: name !== undefined ? name : product.name,
        description: description !== undefined ? description : product.description,
        price: price !== undefined ? price : product.price,
        min_quantity: min_quantity !== undefined ? min_quantity : product.min_quantity,
        image: image !== undefined ? image : product.image,
      };

      await conn.query(
        `UPDATE Products 
         SET name = ?, description = ?, price = ?, min_quantity = ?, image = ? 
         WHERE id = ?`,
        [
          updatedFields.name,
          updatedFields.description,
          updatedFields.price,
          updatedFields.min_quantity,
          updatedFields.image,
          id
        ]
      );

      socketManager.broadcast('productUpdated');
      throw new transactionHTTPError(200, 'Product updated');
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Failed to update product', error: err.message });
      }
    }
  });
};


// ✔️ מחיקת מוצר (רק אם quantity = 0)
exports.deleteProduct = async (req, res) => {
  await transactionManager.withTransaction(async (conn) => {
    try {
      const id = parseInt(req.params.id);

      const [products] = await conn.query('SELECT * FROM Products WHERE id = ?', [id]);
      if (products.length === 0) {
        throw new transactionHTTPError(404, 'Product not found');
      }

      if (products[0].quantity > 0) {
        throw new transactionHTTPError(400, 'Cannot delete product with quantity > 0');
      }

      await conn.query('DELETE FROM Products WHERE id = ?', [id]);
      socketManager.broadcast('productUpdated');
      throw new transactionHTTPError(200, 'Product deleted');
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Failed to delete product', error: err.message });
      }
    }
  });
};
