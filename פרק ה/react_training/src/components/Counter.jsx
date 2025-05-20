import React from "react";
import useCounter from "./useCounter";

function Counter({deleteCounter, t}) {
  const { count, increment, decrement, reset } = useCounter();
  return (
    <div className="card p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-2">🔢 מונה</h2>
      <p className="text-lg">נלחץ {count} פעמים</p>
      <div className="mt-2 space-x-2">
        <button onClick={increment} className="btn btn-success">הוסף</button>
        <button onClick={decrement} className="btn btn-primary">הפחת</button>
        <button onClick={reset} className="btn btn-danger">איפוס</button>
      </div>
      <button onClick={() => deleteCounter(t)}>מחיקה</button>
    </div>
  );
}

export default Counter;