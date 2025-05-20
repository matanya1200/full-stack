import React, { useState, useEffect, useRef, useContext, createContext } from "react";
import Counter from "./components/Counter";
import Timer from "./components/Timer";
import ThemeToggler from "./components/ThemeToggler";

export const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("light");

  const [counters, setCounters] = useState([{ id: Date.now() }]);

  const [timers, setTimers] = useState([{ id: Date.now() }]);

  const addCounter = () => {
    setCounters([...counters, { id: Date.now() }]);
  };

  const addTimer = () => {
    setTimers([...timers, { id: Date.now() }]);
  };

  const deleteCounter = (indexToDelete) => {
    if (window.confirm("למחוק את המונה?")) {
      setCounters(counters.filter((_, i) => i !== indexToDelete));
    }
  };

  const deleteTimer = (indexToDelete) => {
    if (window.confirm("למחוק את המונה?")) {
      setTimers(timers.filter((_, i) => i !== indexToDelete));
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => t === "light" ? "dark" : "light") }}>
      <div className={`min-h-screen p-4 ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"}`}>
        <h1 className="text-2xl font-bold mb-4">🎣 React Hooks Demo</h1>
        
        <ThemeToggler />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <button className="btn btn-success mb-3" onClick={addCounter}>➕ הוסף מונה</button>
          <div className="row">
            {counters.map((counter, i) => (
              <div key={counter.id} className="col-md-4 mb-3">
                <Counter deleteCounter={deleteCounter} t={i}/>
              </div>
            ))}
          </div>

          <button className="btn btn-success mb-3" onClick={addTimer}>➕ הוסף טיימר</button>
          <div className="row">
            {timers.map((timer, i) => (
              <div key={timer.id} className="col-md-4 mb-3">
                <Timer deleteTimer={deleteTimer} t={i}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;