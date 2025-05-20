import React, { useContext } from "react";
import { ThemeContext } from "../App";

function ThemeToggler() {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <button onClick={toggle} className="btn btn-primary col-md-4 mb-3">
      החלף לנושא {theme === "light" ? "בהיר" : "כהה"}
    </button>
  );
}

export default ThemeToggler;