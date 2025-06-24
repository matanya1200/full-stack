function factorial(n) {
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

function primesUpTo(n) {
  const primes = [];
  for (let i = 2; i <= n; i++) {
    if (isPrime(i)) primes.push(i);
  }
  return primes;
}

function isPrime(num) {
  for (let i = 2; i <= Math.sqrt(num); i++)
    if (num % i === 0) return false;
  return num > 1;
}

function fibonachi(num){
  if (num === 0) return 0;
  if (num === 1) return 1;

  let num1 = 0;
  let num2 = 1;
  let num3;
  
  for (let i = 2; i< num; i++){
    num3 = num1 + num2;
    num1 = num2;
    num2 = num3;
  }

  return num2;
}

function perfectNumberUpTo(num){
  const resolt = [];
  
  for(let i = 0; i<num; i++){
    if (isPerfect(i)) resolt.push(i);
  }

  return resolt;
}

function isPerfect(num){

  if (num < 2) return false;

  let sum = 1;
  const sqrt = Math.floor(Math.sqrt(num));

  for (let i = 2; i <= sqrt; i++) {
    if (num % i === 0) {
      sum += i;
      const pair = num / i;
      if (pair !== i) sum += pair;
    }
  }

  if(num === sum) return true;
  return false;
}

module.exports = { factorial, primesUpTo, fibonachi, perfectNumberUpTo };
