import React from "react";

function KeyboardLayout({layouts, layout, handleKeyClick }) {

  return (
    <div className="keys-grid">
        {layouts[layout]?.map((char) => (
          <button className="key" key={char} onClick={() => handleKeyClick(char)} style={{ padding: "10px", fontSize: "16px" }}>
            {char}
          </button>
        ))}
      </div>
  );
}

export default KeyboardLayout;
