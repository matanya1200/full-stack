const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// ----- 📄 קבצי טקסט -----
router.get('/', (req, res) => {
  res.send(`
    <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    </head>
    <body class="container py-5">
      <h1 class="mb-4 text-center">🔗 Text Files</h1>
      <ul class="list-group">
        <li class="list-group-item"><a href="/files/people">People</a></li>
        <li class="list-group-item"><a href="/files/shops">Shops</a></li>
        <li class="list-group-item"><a href="/">Back to main</a></li>
      </ul>
    </body>
    </html>
  `);
});

router.get('/:fileName', (req, res) => {
  const filePath = path.join(__dirname, '..', 'files', `${req.params.fileName}.txt`);
  if (fs.existsSync(filePath)) {
    const text = fs.readFileSync(filePath, 'utf8');
    res.send(`
        <html>
        <head>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        </head>
        <body class="container py-4">
            <h2 class="mb-3">📄 ${req.params.fileName}.txt</h2>
            <pre class="bg-light p-3 border">${text}</pre>
            <a href="/files" class="btn btn-secondary mt-3">Back</a>
        </body>
        </html>
    `);
  } else {
    res.status(404).send('File not found');
  }
});

module.exports = router;    