import React from "react";

function KeyboardControls({ handleBackspace, handleEnter, moveCursorLeft, moveCursorRight, handleKeyClick }) {
  return (
    <div className="special-keys">
        <button className="key special backspace" onClick={handleBackspace}>🔙 Backspace</button>
        <button className="key special enter" onClick={handleEnter}>↩ Enter</button>
        <button className="key special space" onClick={() => handleKeyClick(" ")}>⎵ Space</button>
        <button className="key special arrow" onClick={moveCursorRight}>▶</button>
        <button className="key special arrow" onClick={moveCursorLeft}>◀</button>
      </div>
  );
}

export default KeyboardControls;
