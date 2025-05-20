import React, { useEffect, useRef, useState } from "react";

function Timer({deleteTimer, t}) {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="card p-4 shadow-md">
      <h2 className="text-xl font-semibold mb-2">⏲ טיימר</h2>
      <p className="text-lg">עברו {seconds} שניות</p>

      <button onClick={() => deleteTimer(t)}>מחיקה</button>
    </div>
  );
}

export default Timer;