import { useState } from "react";

function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c == 0 ? 0 : c - 1);
  const reset = () => setCount(initial);
  return { count, increment, decrement, reset };
}

export default useCounter;