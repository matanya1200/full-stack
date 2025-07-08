// controllers/productsController.js
const db = require('../db');
const { getUserDiscount } = require('../utils/discountUtils');

// ✔️ קבלת כל המוצרים עם עימוד
exports.getAllProducts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;

  const discount = getUserDiscount(req.user.role);

  try {
    const [products] = await db.query(
      `SELECT id, name, description, quantity, min_quantity, department_id, image_url,
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
      `SELECT id, name, description, quantity, min_quantity, department_id, image_url,
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
      `SELECT id, name, description, quantity, min_quantity, department_id, image_url,
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
      `SELECT id, name, description, quantity, min_quantity, department_id, image_url,
              price * ? AS discounted_price
       FROM Products WHERE name LIKE ? LIMIT ? OFFSET ?`,
      [discount, `%${search}%`, limit, offset]
    );
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};

// ✔️ קבלת מוצר לפי id
exports.getProductById = async (req, res) => {
  const id = parseInt(req.params.id);
  const discount = getUserDiscount(req.user.role);
  try {
    const [products] = await db.query(`SELECT id, name, description, quantity, min_quantity, department_id, image_url,
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
  const { name, description, price, quantity, min_quantity, department_id, image_url } = req.body;

  try {
    await db.query(
      `INSERT INTO Products (name, description, price, quantity, min_quantity, department_id, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, quantity, min_quantity, department_id, image_url]
    );
    res.status(201).json({ message: 'Product created' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create product', error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description, price, min_quantity, image_url } = req.body;

  try {
    const [products] = await db.query('SELECT * FROM Products WHERE id = ?', [id]);
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const product = products[0];
    const user = users[0];

    const isAdmin = user.role === 'admin';
    const isWorker = user.role === 'worker' && user.department_id === product.department_id;

    if (!isAdmin && !isWorker) {
      return res.status(403).json({ message: 'No permission to update this product' });
    }

    // בונים דינמית את השדות לעדכון
    const updatedFields = {
      name: name !== undefined ? name : product.name,
      description: description !== undefined ? description : product.description,
      price: price !== undefined ? price : product.price,
      min_quantity: min_quantity !== undefined ? min_quantity : product.min_quantity,
      image_url: image_url !== undefined ? image_url : product.image_url,
    };

    await db.query(
      `UPDATE Products 
       SET name = ?, description = ?, price = ?, min_quantity = ?, image_url = ? 
       WHERE id = ?`,
      [
        updatedFields.name,
        updatedFields.description,
        updatedFields.price,
        updatedFields.min_quantity,
        updatedFields.image_url,
        id
      ]
    );

    res.json({ message: 'Product updated' });

  } catch (err) {
    res.status(500).json({ message: 'Failed to update product', error: err.message });
  }
};


// ✔️ מחיקת מוצר (רק אם quantity = 0)
exports.deleteProduct = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const [products] = await db.query('SELECT * FROM Products WHERE id = ?', [id]);
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (products[0].quantity > 0) {
      return res.status(400).json({ message: 'Cannot delete product with quantity > 0' });
    }

    await db.query('DELETE FROM Products WHERE id = ?', [id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product', error: err.message });
  }
};
