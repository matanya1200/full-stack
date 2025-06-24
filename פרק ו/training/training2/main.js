// main.js
const complex = require('./complex');

// יצירת שני מספרים מרוכבים
const c1 = complex.create(3, 2); // 3 + 2i
const c2 = complex.create(1, 4); // 1 + 4i

// חיבור
const sum = complex.add(c1, c2);
console.log(`(${c1.real} + ${c1.img}i) + (${c2.real} + ${c2.img}i) = ${sum.real} + ${sum.img}i`);

// כפל
const product = complex.mult(c1, c2);
console.log(`(${c1.real} + ${c1.img}i) * (${c2.real} + ${c2.img}i) = ${product.real} + ${product.img}i`);
