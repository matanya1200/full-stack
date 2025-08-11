// controllers/cartController.js
const db = require('../db');
const { getUserDiscount } = require('../utils/discountUtils');
const transactionManager = require('../utils/transactionManager');
const socketManager = require('../utils/socketManager');
const transactionHTTPError = require('../utils/transactionHTTPError');

// ✔️ admin – קבלת כל העגלות
exports.getAllCarts = async (req, res) => {
  try {
    const [items] = await db.query(`
      SELECT c.id, c.user_id, u.name AS user_name, c.product_id, p.name AS product_name, c.quantity
      FROM CartItems c
      JOIN Users u ON c.user_id = u.id
      JOIN Products p ON c.product_id = p.id
    `);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all carts', error: err.message });
  }
};

// ✔️ משתמש – קבלת העגלה האישית
exports.getCartByUser = async (req, res) => {
  const discount = getUserDiscount(req.user.role);
  const userId = parseInt(req.params.user_id);

  if (req.user.id != userId && req.user.role != 'admin') {
    console.log(req.user.id,userId);
    return res.status(403).json({ message: 'Access denied' });
  }

  try {
    const [items] = await db.query(`
      SELECT c.id, u.name AS user_name, c.product_id, p.name AS product_name, c.quantity, p.price * ? AS price, (c.quantity * (p.price * ?)) AS total
      FROM CartItems c
      JOIN Users u ON c.user_id = u.id
      JOIN Products p ON c.product_id = p.id
      WHERE c.user_id = ?
    `, [discount, discount, userId]);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user cart', error: err.message });
  }
};

// ✔️ משתמש – הוספת/עידכון מוצר לסל
exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  if (!product_id || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid product or quantity' });
  }

  await transactionManager.withTransaction(async (conn) => {
    try {
      // Lock product row for update
      const [productRows] = await conn.query('SELECT * FROM Products WHERE id = ? FOR UPDATE', [product_id]);
      const product = productRows[0];
      if (!product) {
        throw new transactionHTTPError(404, 'Product not found');
      }

      // Check if item already in cart
      const [existingRows] = await conn.query(
        'SELECT * FROM CartItems WHERE user_id = ? AND product_id = ?',
        [userId, product_id]
      );
      const existing = existingRows[0];
      const totalRequested = quantity + (existing?.quantity || 0);
      if (product.quantity < totalRequested) {
        throw new transactionHTTPError(422, `Requested quantity (${totalRequested}) exceeds available stock (${product.quantity})`);
      }

      if (existing) {
        await conn.query(
          'UPDATE CartItems SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
          [quantity, userId, product_id]
        );
      } else {
        await conn.query(
          'INSERT INTO CartItems (user_id, product_id, quantity) VALUES (?, ?, ?)',
          [userId, product_id, quantity]
        );
      }
      
      // Notify all user devices/tabs
      //socketManager.notifyUser(userId, 'cartUpdated', { product_id, quantity });
      socketManager.notifyUser(userId, 'cartUpdated');
      res.status(201).json({ message: 'Product added to cart' });
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Failed to add to cart', error: err.message });
      }
    }
  });
};


exports.updateCartProduct = async (req, res) => {
  const userId = parseInt(req.params.user_id);
  const product_id = parseInt(req.params.product_id);
  const { quantity } = req.body;

  if (req.user.id !== userId) {
    return res.status(403).json({ message: 'You can only update your own cart' });
  }

  if (quantity < 0) {
    return res.status(400).json({ message: 'Quantity must be 0 or more' });
  }

  await transactionManager.withTransaction(async (conn) => {
    try {
      const [productRows] = await conn.query('SELECT * FROM Products WHERE id = ?', [product_id]);
      const product = productRows[0];

      if (!product) {
        throw new transactionHTTPError(404, 'Product not found');
      }

      if (product.quantity < quantity) {
        throw new transactionHTTPError(422, `Requested quantity (${quantity}) exceeds available stock (${product.quantity})`);
      }

      const [items] = await  conn.query(
        'SELECT * FROM cartItems WHERE user_id = ? AND product_id = ?',
        [userId, product_id]
      );

      if (items.length === 0) {
        throw new transactionHTTPError(404, 'Product not found in cart');
      }

      await conn.query(
        'UPDATE CartItems SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, product_id]
      );
      
      //socketManager.notifyUser(userId, 'cartUpdated', { product_id, quantity });
      socketManager.notifyUser(userId, 'cartUpdated');
      res.status(200).json({ message: 'Cart item updated successfully' });
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Failed to update cart item', error: err.message });
      }
    }
  });
};


// ✔️ משתמש – מחיקת פריט מהעגלה לפי cart item id
exports.deleteCartItem = async (req, res) => {
  const id = parseInt(req.params.id);
  const userId = req.user.id;

  await transactionManager.withTransaction(async (conn) => {
    try {
      const [items] = await conn.query('SELECT * FROM CartItems WHERE id = ?', [id]);
      if (items.length === 0) {
        throw new transactionHTTPError(404, 'Cart item not found');
      }

      if (items[0].user_id !== userId) {
        throw new transactionHTTPError(403, 'You can only delete your own cart items');
      }

      await conn.query('DELETE FROM CartItems WHERE id = ?', [id]);
      
      //socketManager.notifyUser(userId, 'cartUpdated', { deleted: id });
      socketManager.notifyUser(userId, 'cartUpdated');
      res.json({ message: 'Cart item deleted' });
    } catch (err) {
      if (err instanceof transactionHTTPError) {
        res.status(err.statusCode).json({ message: err.message });
      } else {
        res.status(500).json({ message: 'Failed to delete cart item', error: err.message });
      }
    }
  });
};

exports.getCartItem = async (req,res) => {
  const userId = req.params.user_id;
  const productId = req.params.product_id;
  try{
    const[items] = await db.query('SELECT * FROM cartitems WHERE user_id = ? AND product_id = ?', [userId, productId]);
    if (items.length === 0) {
      return res.status(404).json({ message: 'you don\'t have this item in your cart' });
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get cart item', error: err.message });
  }
}