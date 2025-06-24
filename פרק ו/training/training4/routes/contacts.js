const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// ----- 📦 JSON - אנשי קשר -----
router.get('/', (req, res) => {
  const jsonPath = path.join(__dirname, '..', 'data', 'contacts.json');
  const contacts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  //פונקציה ליצירת כרטיסיות אנשי קשר
  //בשורה 16 נוצר טופס למנווט לעמוד מחיקה
  const contactCards = contacts.map((c, index) => `
    <div class="card m-2 p-2" style="min-width: 250px;">
      <div class="card-body">
        <h5 class="card-title">👤 ${c.name}</h5>
        <p class="card-text"><strong>📞 Phone:</strong> ${c.phone}</p>
        <p class="card-text"><strong>📧 Email:</strong> ${c.email}</p>
        <a href="/contacts/${index}" class="btn btn-primary">JSON View</a>
        <form method="POST" action="/contacts/delete" onsubmit="return confirm('בטוח שברצונך למחוק?')">
          <input type="hidden" name="index" value="${index}" />
          <button type="submit" class="btn btn-danger btn-sm">🗑 מחק</button>
        </form>
      </div>
    </div>
  `).join("");

  //הצגת הכרטיסיות
  //בשורה 39 יש כפתור שמנוות לעמוד יצירה
  res.send(`
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Contacts</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container py-4">
      <h1 class="text-center text-info mb-4">📇 contacts list</h1>
      <div class="d-flex flex-wrap justify-content-center">
        ${contactCards}
      </div>
      <div>
        <a href="/contacts/new" class="btn btn-success mt-3">➕ Add Contact</a> 
      </div>
      <a href="/" class="btn btn-secondary mt-4">⬅ Back to main</a>
    </body>
    </html>
  `);
});

//עמוד יצירת איש קשר חדש
//מציג טופס שמפעיל קריאה לpost שיוצר משתנה
router.get('/new', (req, res) => {
  res.send(`
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>Add Contact</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body class="container py-4">
      <h1 class="text-center mb-4">➕ Add New Contact</h1>
      <form method="POST" action="/contacts/new" class="mx-auto" style="max-width: 400px;">
        <div class="mb-3">
          <label class="form-label">Name</label>
          <input type="text" name="name" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Phone</label>
          <input type="text" name="phone" class="form-control" required />
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" name="email" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-success w-100">Save Contact</button>
      </form>
      <a href="/contacts" class="btn btn-secondary">⬅ Back to Contacts</a>
    </body>
    </html>
  `);
});

router.post('/new', (req, res) => {
  const { name, phone, email } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).send("Missing fields");
  }

  const jsonPath = path.join(__dirname, '..', 'data', 'contacts.json');
  const contacts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  contacts.push({ name, phone, email });

  fs.writeFileSync(jsonPath, JSON.stringify(contacts, null, 2), 'utf8');

  res.redirect('/contacts');
});

//עמוד מחקת איש קשר
router.post('/delete', (req, res) => {
  const index = parseInt(req.body.index);
  const jsonPath = path.join(__dirname, '..', 'data', 'contacts.json');
  let contacts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  if (!isNaN(index) && index >= 0 && index < contacts.length) {
    contacts.splice(index, 1);
    fs.writeFileSync(jsonPath, JSON.stringify(contacts, null, 2), 'utf8');
    res.redirect('/contacts');
  } else {
    res.status(400).send("Invalid contact index.");
  }
});

router.get('/:id', (req, res) => {
  const jsonPath = path.join(__dirname, '..', 'data', 'contacts.json');
  const contacts = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const index = parseInt(req.params.id, 10);
  if (contacts[index]) {
    res.json(contacts[index]);
  } else {
    res.status(404).json({ error: "Contact not found" });
  }
});

module.exports = router;