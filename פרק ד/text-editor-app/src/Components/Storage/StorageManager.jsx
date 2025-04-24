import React, { useState } from "react";
import "../Styles/StorageManager.css";

function StorageManager({ text, selectedFont, selectedSize, selectedColor,activeUserName, cursorPos }) {
  const [fileName, setFileName] = useState("");


  const saveAsText = () => {
    const name = prompt("הזן שם קובץ:");
    if (name) {
      const content = {
        text: text,
        style: { font: selectedFont, size: selectedSize, color: selectedColor },
        owner: activeUserName,
        cursorPos: cursorPos
      };
      localStorage.setItem(name, JSON.stringify(content));
      setFileName(name);
      alert(`הטקסט נשמר בשם "${name}"`);
    }
  };

  return (
    <div className="storage-container">
      <button className="storage-button" onClick={saveAsText}>💾 Save</button>
    </div>
  );
}

export default StorageManager;
