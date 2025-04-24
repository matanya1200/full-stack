import React, { useState } from "react";
import "../Styles/StorageManager.css";

function StorageManager({ activeTextId, text, selectedFont, selectedSize, selectedColor,activeUserName, cursorPos, closeText }) {
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
      closeText(activeTextId);
    }
  };

  return (
    <div className="storage-container">
      <button className="storage-button" onClick={saveAsText}>💾 Save</button>
    </div>
  );
}

export default StorageManager;
