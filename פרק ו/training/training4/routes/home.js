const express = require('express');
const router = express.Router();

// דף הבית - ניווט לכל הנתיבים
router.get('/', (req, res) => {
  res.send(`
    <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    </head>
    <body class="container py-5">
      <h1 class="mb-4 text-center">🔗 Welcome</h1>
      <ul class="list-group">
        <li class="list-group-item"><a href="/pages">📄 Pages</a></li>
        <li class="list-group-item"><a href="/files">📁 Files</a></li>
        <li class="list-group-item"><a href="/contacts">👥 Contacts (JSON)</a></li>
        <li class="list-group-item"><a href="/comps">🧮 Calculations</a></li>
      </ul>
    </body>
    </html>
  `);
});

module.exports = router;