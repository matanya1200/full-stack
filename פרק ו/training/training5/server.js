const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// הגדרת חיבור למסד נתונים
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '2iW4sF7r', // שנה לפי הצורך
  database: 'school_db'
};

async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

// 📘 CREATE - הוספת תלמיד חדש
app.post('/students', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'שם חובה' });

  const conn = await getConnection();
  const [result] = await conn.execute('INSERT INTO student (name) VALUES (?)', [name]);
  conn.end();
  res.json({ message: 'תלמיד נוסף', id: result.insertId });
});

// 📗 READ - קבלת רשימת תלמידים
app.get('/students', async (req, res) => {
  const conn = await getConnection();
  const [students] = await conn.execute('SELECT * FROM student ORDER BY id');
  conn.end();
  res.json(students);
});

// 📙 UPDATE - עדכון שם תלמיד לפי ID
app.put('/students/:id', async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;
  if (!name) return res.status(400).json({ error: 'שם חובה' });

  const conn = await getConnection();
  const [result] = await conn.execute('UPDATE student SET name = ? WHERE id = ?', [name, id]);
  conn.end();

  if (result.affectedRows === 0)
    return res.status(404).json({ error: 'תלמיד לא נמצא' });

  res.json({ message: 'תלמיד עודכן' });
});

// 📕 DELETE - מחיקת תלמיד לפי ID
app.delete('/students/:id', async (req, res) => {
  const { id } = req.params;
  const conn = await getConnection();
  const [result] = await conn.execute('DELETE FROM student WHERE id = ?', [id]);
  conn.end();

  if (result.affectedRows === 0)
    return res.status(404).json({ error: 'תלמיד לא נמצא' });

  res.json({ message: 'תלמיד נמחק' });
});

// 🎯 הרצת השרת
app.listen(3000, () => {
  console.log('🚀 שרת פועל על http://localhost:3000');
});
