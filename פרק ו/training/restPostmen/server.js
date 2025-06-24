const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // כדי לקרוא JSON מה־body

// דאטה זמנית בזיכרון
let items = [
  { id: 1, name: "Item One" },
  { id: 2, name: "Item Two" }
];

// GET - שליפת כל הפריטים
app.get('/items', (req, res) => {
  res.json(items);
});

// GET - שליפת פריט לפי ID
app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
});

// POST - הוספת פריט חדש
app.post('/items', (req, res) => {
  const { name } = req.body;
  const newItem = { id: Date.now(), name };
  items.push(newItem);
  res.status(201).json(newItem);
});

// PUT - עדכון פריט קיים
app.put('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: "Item not found" });
  item.name = req.body.name;
  res.json(item);
});

// DELETE - מחיקת פריט
app.delete('/items/:id', (req, res) => {
  const index = items.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Item not found" });
  const deleted = items.splice(index, 1);
  res.json(deleted[0]);
});

// התחלת השרת
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
