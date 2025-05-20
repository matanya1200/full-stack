import React, { useState } from "react";
import Clock from "./components/Clock";

function App() {
  const [clocks, setClocks] = useState([
    { name: "JLM", offset: 3, updateInterval: 1 },
    { name: "LON", offset: 0, updateInterval: 1 },
    { name: "NYC", offset: -4, updateInterval: 1 }
  ]);

  const updateClockInterval = (index, newInterval) => {
    const updated = [...clocks];
    updated[index].updateInterval = newInterval;
    setClocks(updated);
  };

  const resetAll = () => {
    setClocks(clocks.map(c => ({ ...c, updateInterval: 1 })));
  };

  const doubleAll = () => {
    setClocks(clocks.map(c => ({ ...c, updateInterval: c.updateInterval * 2 })));
  };

  const randomAll = () => {
    setClocks(clocks.map(c => ({ ...c, updateInterval: Math.floor(Math.random() * 10) + 1 })));
  };

  const addClock = () => {
    const name = prompt("הזן שם עיר:");
    const offset = parseInt(prompt("הזן הפרש שעות מ־UTC (למשל 2 או -5):"));
    if (name && !isNaN(offset)) {
      setClocks([...clocks, { name, offset, updateInterval: 1 }]);
    } else {
      alert("ערכים לא תקינים");
    }
  };

  const deleteClock = (indexToDelete) => {
    if (window.confirm("למחוק את השעון?")) {
      setClocks(clocks.filter((_, i) => i !== indexToDelete));
    }
  };

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">🕒 Clocks All</h1>

      <div className="d-flex justify-content-center gap-2 mb-4 flex-wrap">
        <button className="btn btn-secondary" onClick={resetAll}>Reset All Intervals</button>
        <button className="btn btn-secondary" onClick={doubleAll}>Double All Intervals</button>
        <button className="btn btn-secondary" onClick={randomAll}>Randomize All Intervals</button>
        <button className="btn btn-success" onClick={addClock}>➕ Add Clock</button>
      </div>

      <div className="row g-4">
        {clocks.map((c, i) => (
          <div key={i} className="col-md-4">
            <div className="card h-100 text-center">
              <div className="card-body">
                <Clock
                  city={c.name}
                  offset={c.offset}
                  updateInterval={c.updateInterval}
                  onIntervalChange={(newVal) => updateClockInterval(i, newVal)}
                />
                <button className="btn btn-outline-danger mt-3" onClick={() => deleteClock(i)}>
                  🗑 מחק שעון
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;