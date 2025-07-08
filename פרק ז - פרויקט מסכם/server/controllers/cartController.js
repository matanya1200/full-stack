// controllers/cartController.js
const db = require('../db');
const { getUserDiscount } = require('../utils/discountUtils');

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
      SELECT c.id, c.product_id, p.name AS product_name, c.quantity, p.price * ? AS price, (c.quantity * (p.price * ?)) AS total
      FROM CartItems c
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

  try {
    // שליפת פרטי המוצר
    const [productRows] = await db.query('SELECT * FROM Products WHERE id = ?', [product_id]);
    const product = productRows[0];

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // בדיקה אם הפריט כבר קיים בסל
    const [existingRows] = await db.query(
      'SELECT * FROM CartItems WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );
    const existing = existingRows[0];

    const totalRequested = quantity + (existing?.quantity || 0);

    if (product.quantity < totalRequested) {
      return res.status(422).json({
        message: `Requested quantity (${totalRequested}) exceeds available stock (${product.quantity})`
      });
    }

    if (existing) {
      // אם קיים – עדכון
      await db.query(
        'UPDATE CartItems SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, product_id]
      );
    } else {
      // אחרת – הוספה חדשה
      await db.query(
        'INSERT INTO CartItems (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, product_id, quantity]
      );
    }

    res.status(201).json({ message: 'Product added to cart' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to cart', error: err.message });
  }
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

  try {
    const [productRows] = await db.query('SELECT * FROM Products WHERE id = ?', [product_id]);
    const product = productRows[0];

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.quantity < quantity) {
      return res.status(422).json({
        message: `Requested quantity (${quantity}) exceeds available stock (${product.quantity})`
      });
    }

    const [items] = await db.query(
      'SELECT * FROM cartItems WHERE user_id = ? AND product_id = ?',
      [userId, product_id]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    await db.query(
      'UPDATE CartItems SET quantity = ? WHERE user_id = ? AND product_id = ?',
      [quantity, userId, product_id]
    );

    res.status(200).json({ message: 'Cart item updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart item', error: err.message });
  }
};


// ✔️ משתמש – מחיקת פריט מהעגלה לפי cart item id
exports.deleteCartItem = async (req, res) => {
  const id = parseInt(req.params.id);
  const userId = req.user.id;

  try {
    const [items] = await db.query('SELECT * FROM CartItems WHERE id = ?', [id]);
    if (items.length === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (items[0].user_id !== userId) {
      return res.status(403).json({ message: 'You can only delete your own cart items' });
    }

    await db.query('DELETE FROM CartItems WHERE id = ?', [id]);
    res.json({ message: 'Cart item deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete cart item', error: err.message });
  }
};

exports.getCartItem = async (req,res) => {
  const userId = req.params.user_id;
  const productId = req.params.product_id;
  try{
    const[items] = await db.query('SELECT * FROM cartitems WHERE user_id = ? AND product_id = ?', [userId, productId]);
    if (items.length === 0) {
      return res.status(404).json({ message: 'you dont have this item in your cart' });
    }
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get cart item', error: err.message });
  }
}