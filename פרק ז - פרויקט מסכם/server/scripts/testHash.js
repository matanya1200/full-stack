// testHash.js
const { hashPassword, comparePasswords } = require('../utils/hashUtils');

async function test() {
  const password = 'storekeeperdanny';

  const hash = await hashPassword(password);
  console.log('Hash:', hash);

  const isMatch = await comparePasswords('admin123', hash);
  console.log('Match:', isMatch); // true

  const wrong = await comparePasswords('wrongpass', hash);
  console.log('Wrong Match:', wrong); // false
}

test();
