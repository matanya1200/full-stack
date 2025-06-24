const db = require('../db');

// POST /register
// register handled via userController.createUser

// POST /login
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required' });
  }

  try {
    // קבל את המשתמש
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = users[0];

    // קבל את הסיסמה שלו
    const [passRows] = await db.query(
      'SELECT password FROM passwords WHERE user_id = ?',
      [user.id]
    );

    if (passRows.length === 0 || passRows[0].password !== password) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // החזר את המידע הרלוונטי על המשתמש (לא כולל סיסמה)
    res.json({
      massage:"Login successfully",
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name
    });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
