const db = require('../db');

// GET /users
exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
};

// GET /users/:id
exports.getUserById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
};

// POST /users
exports.createUser = async (req, res) => {
  const { name, username, email, password } = req.body;

  if (!name || !username || !email || !password) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // בדוק אם המשתמש כבר קיים
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // הוסף משתמש
    const [userResult] = await db.query(
      'INSERT INTO users (username, email, name) VALUES (?, ?, ?)',
      [username, email || null, name || null]
    );

    const userId = userResult.insertId;

    // הוסף סיסמה
    await db.query(
      'INSERT INTO passwords (user_id, password) VALUES (?, ?)',
      [userId, password]
    );

    res.status(201).json({ message: 'User registered successfully', user_id: userId });

  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//PUT /users/:id
//אפשר לעדכון אחד או יותר מהפריטים (שם,שם משתמש, אמייל, סיסמה) לפי מה שאנחנו מעבירים
exports.updateUser = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const existingUser = rows[0];
    const { name, username, email, password } = req.body;

     // אם שדה לא נשלח – שומרים את הערך הקיים
    const updatedName = name ?? existingUser.name;
    const updatedUsername = username ?? existingUser.username;
    const updatedEmail = email ?? existingUser.email;
    
    await db.query(
      'UPDATE users SET name = ?, username = ?, email = ? WHERE id = ?',
      [updatedName, updatedUsername, updatedEmail, req.params.id]
    );
    
    const [passRow] = await db.query('SELECT password FROM passwords WHERE user_id = ?', [req.params.id])
    const currentPasswordFromDB = passRow[0]?.password

    if (req.body.currentPassword !== currentPasswordFromDB) {
      return res.status(401).json({ message: 'סיסמה נוכחית שגויה' })
    }

    if(password != null && password !== '' ){
      await db.query(
        'UPDATE passwords SET password = ? WHERE user_id = ?',
        [password, req.params.id ]
      );
    }
    res.status(200).json({ message: 'User updated'});
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
};

// DELETE /users/:id
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  const { password } = req.body;

  try {
    const [passRow] = await db.query('SELECT password FROM passwords WHERE user_id = ?', [userId]);
    const actualPassword = passRow[0]?.password;

    if (password !== actualPassword) {
      return res.status(401).json({ message: 'סיסמה שגויה. מחיקה נכשלה.' });
    }

    await db.query('DELETE FROM passwords WHERE user_id = ?', [userId]);
    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    res.status(200).json({ message: 'המשתמש נמחק' });
  } catch (err) {
    res.status(500).json({ message: 'שגיאה במחיקה', error: err.message });
  }
};

