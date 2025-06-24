console.log("Hilma Hello\n");

console.log("prime nambers between 1 and 1000\n")
function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

for (let i = 1; i <= 1000; i++) {
  if (isPrime(i)) {
    console.log(i);
  }
}

const number = parseInt(process.argv[2]);

if (isNaN(number) || number < 0) {
  console.log("❌ נא לספק מספר חיובי");
  process.exit(1);
}

let result = 1;
for (let i = 2; i <= number; i++) {
  result *= i;
}

console.log(`${number}! = ${result}`);
