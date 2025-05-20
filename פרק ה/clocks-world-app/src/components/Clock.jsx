import React, { useEffect, useState } from "react";

function Clock({ city, offset, updateInterval, onIntervalChange }) {
  const [time, setTime] = useState(getTime());

  function getTime() {
    const now = new Date();
    now.setHours(now.getUTCHours() + offset);
    return now.toLocaleTimeString();
  }

  useEffect(() => {
    const id = setInterval(() => setTime(getTime()), updateInterval * 1000);
    return () => clearInterval(id);
  }, [updateInterval, offset]);

  const updateNow = () => setTime(getTime());

  return (
    <div>
      <h4 className="mb-2">{city}</h4>
      <p className="display-6">{time}</p>
      <p>⏱ Every {updateInterval}s</p>
      <div className="d-grid gap-2">
        <button className="btn btn-warning btn-sm" onClick={() => onIntervalChange(1)}>Reset My Interval</button>
        <button className="btn btn-info btn-sm" onClick={() => onIntervalChange(updateInterval * 2)}>Double My Interval</button>
        <button className="btn btn-primary btn-sm" onClick={updateNow}>Update Me Now</button>
      </div>
    </div>
  );
}

export default Clock;
