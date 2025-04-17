import React, { useState } from "react";
import "./Styles/StorageManager.css";

function StorageManager({ text, selectedFont, selectedSize, selectedColor,activeUserName, cursorPos }) {
  const [fileName, setFileName] = useState("");

  const saveText = () => {
  if (fileName) {
    const content = {
      text: text.map(({ char, font, size, color }) => ({
        char,
        font: font || selectedFont,
        size: size || selectedSize,
        color: color || selectedColor
      })),
      style: { font: selectedFont, size: selectedSize, color: selectedColor },
      owner: activeUserName,
      cursorPos: cursorPos
    };
    localStorage.setItem(fileName, JSON.stringify(content));
    alert(`הטקסט נשמר בשם "${fileName}"`);
  } else {
    alert("יש להזין שם קובץ!");
  }
};


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
      <input 
        type="text" 
        value={fileName} 
        onChange={(e) => setFileName(e.target.value)} 
        placeholder="שם קובץ" 
        className="storage-input"
      />
      <button className="storage-button" onClick={saveText}>💾 Save</button>
      <button className="storage-button" onClick={saveAsText}>💾 Save As</button>
    </div>
  );
}

export default StorageManager;
