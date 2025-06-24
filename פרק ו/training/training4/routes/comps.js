const express = require('express');
const { factorial, primesUpTo, fibonachi, perfectNumberUpTo } = require('../utils/math');
const router = express.Router();

// ----- 🧮 חישובים -----
router.get('/', (req, res) => {
  res.send(`
    <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    </head>
    <body class="container py-5">
      <h1 class="mb-4 text-center">🧮 Computations:</h1>
      <ul class="list-group">
        <li class="list-group-item"><a href="/comps/factorial/5">Factorial 5</a></li>
        <li class="list-group-item"><a href="/comps/primes/30">Primes up to 30</a></li>
        <li class="list-group-item"><a href="/comps/perfectNumber/500">perfect numbers to 500</a></li>
        <li class="list-group-item"><a href="/comps/fibonachi/10">fibonachi 10</a></li>
        <li class="list-group-item"><a href="/">Back to main</a></li>
      </ul>
    </body>
    </html>
  `);
});

router.get('/factorial/:n', (req, res) => {
  const n = parseInt(req.params.n, 10);
  if (isNaN(n) || n < 0) return res.status(400).send("Invalid number");

  res.send(`
    <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    </head>
    <body class="container py-5">
      <h1 class="mb-4">factorial:</h1>
      <h2 class="text-primary">${n}! = ${factorial(n)}</h2>
      <h2 class="text-primary">the facorial of ${n} is ${factorial(n)}</h2>

        <form class="mt-4" onsubmit="event.preventDefault(); goToFactorial();">
          <label class="form-label">Enter a new number:</label>
          <input type="number" id="primeInput" class="form-control" required />
          <button type="submit" class="btn btn-success mt-2">Calculate factorial</button>
        </form>
        
      <a href="/comps" class="btn btn-secondary mt-4">⬅ Back to Computations</a>

        <script>
          function goToFactorial() {
            const val = document.getElementById("primeInput").value;
            if (val && parseInt(val) > 1) {
              window.location.href = "/comps/factorial/" + val;
            } else {
              alert("יש להזין מספר תקין גדול מ-1");
            }
          }
        </script>
    </body>
    </html>
    `);
});

router.get('/primes/:n', (req, res) => {
  const n = parseInt(req.params.n, 10);
  if (isNaN(n) || n < 2) return res.status(400).send("Invalid number");

  const result = primesUpTo(n);
  res.send(`
    <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    </head>
    <body class="container py-5">
      <h1 class="mb-4">primes:</h1>
      <h2 class="text-primary">the primes numbers up to ${n} are <pre>${result.join(', ')}</pre></h2>

        <form class="mt-4" onsubmit="event.preventDefault(); goToPrimes();">
          <label class="form-label">Enter a new number:</label>
          <input type="number" id="primeInput" class="form-control" required />
          <button type="submit" class="btn btn-success mt-2">Calculate primes</button>
        </form>
        
      <a href="/comps" class="btn btn-secondary mt-4">⬅ Back to Computations</a>

        <script>
          function goToPrimes() {
            const val = document.getElementById("primeInput").value;
            if (val && parseInt(val) > 1) {
              window.location.href = "/comps/primes/" + val;
            } else {
              alert("יש להזין מספר תקין גדול מ-1");
            }
          }
        </script>
    </body>
    </html>
    `);
});

router.get('/perfectNumber/:n', (req, res) => {
  const n = parseInt(req.params.n, 10);
  if (isNaN(n) || n < 2) return res.status(400).send("Invalid number");

  const result = perfectNumberUpTo(n);
  res.send(`
    <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    </head>
    <body class="container py-5">
      <h1 class="mb-4">perfect numbers:</h1>
      <h2 class="text-primary">the prefect numbers up to ${n} are <pre>${result.join(', ')}</pre></h2>

        <form class="mt-4" onsubmit="event.preventDefault(); goToPerfectNumber();">
          <label class="form-label">Enter a new number</label>
          <input type="number" id="primeInput" class="form-control" required />
          <button type="submit" class="btn btn-success mt-2">Calculate perfect numbers</button>
        </form>

      <a href="/comps" class="btn btn-secondary mt-4">⬅ Back to Computations</a>

        <script>
          function goToPerfectNumber() {
            const val = document.getElementById("primeInput").value;
            if (val && parseInt(val) > 1) {
              window.location.href = "/comps/perfectNumber/" + val;
            } else {
              alert("יש להזין מספר תקין גדול מ-1");
            }
          }
        </script>
    </body>
    </html>
    `);
});

router.get('/fibonachi/:n', (req, res) => {
  const n = parseInt(req.params.n, 10);
  if (isNaN(n) || n < 0) return res.status(400).send("Invalid number");

  res.send(`
    <html>
    <head>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    </head>
    <body class="container py-5">
      <h1 class="mb-4">fibonachi:</h1>
      <h2 class="text-primary">fibonachi of ${n} = ${fibonachi(n)}</h2>
      <h2 class="text-primary">the ${n} fibonachi number is ${fibonachi(n)}</h2>

        <form class="mt-4" onsubmit="event.preventDefault(); goToFibonachi();">
          <label class="form-label">Enter a new number:</label>
          <input type="number" id="primeInput" class="form-control" required />
          <button type="submit" class="btn btn-success mt-2">Calculate fibonachi</button>
        </form>

      <a href="/comps" class="btn btn-secondary mt-4">⬅ Back to Computations</a>

      <script>
          function goToFibonachi() {
            const val = document.getElementById("primeInput").value;
            if (val && parseInt(val) > 1) {
              window.location.href = "/comps/fibonachi/" + val;
            } else {
              alert("יש להזין מספר תקין גדול מ-1");
            }
          }
        </script>
    </body>
    </html>
    `);
});

module.exports = router;