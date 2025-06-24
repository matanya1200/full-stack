const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// ----- 📄 עמודי HTML -----
router.get('/', (req, res) => {
  res.send(`
    <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    </head>
    <body class="container py-5">
      <h1 class="mb-4 text-center">📄 Pages</h1>
      <ul class="list-group">
        <li class="list-group-item"><a href="/pages/about">About</a></li>
        <li class="list-group-item"><a href="/pages/sports">Sports</a></li>
        <li class="list-group-item"><a href="/">Back to main</a></li>
      </ul>
    </body>
    </html>
  `);
});

router.get('/:pageName', (req, res) => {
  const pagePath = path.join(__dirname, '..', 'pages', `${req.params.pageName}.html`);
  if (fs.existsSync(pagePath)) {
    res.sendFile(pagePath);
  } else {
    res.status(404).send('Page not found');
  }
});

module.exports = router;