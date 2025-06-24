// מודול complex.js

// יצירת מספר מרוכב מ־a ו־b
function create(a, b) {
  return { real: a, img: b };
}

// חיבור שני מספרים מרוכבים
function add(c1, c2) {
  return {
    real: c1.real + c2.real,
    img: c1.img + c2.img
  };
}

// כפל שני מספרים מרוכבים: (a + bi)(c + di) = (ac - bd) + (ad + bc)i
function mult(c1, c2) {
  return {
    real: c1.real * c2.real - c1.img * c2.img,
    img: c1.real * c2.img + c1.img * c2.real
  };
}

// ייצוא
module.exports = {
  create,
  add,
  mult
};
