import React from "react";

const fonts = ["Arial", "Courier New", "Times New Roman", "Verdana", "Georgia"];
const sizes = [12, 16, 20, 24, 28, 32, 36];
const colors = [ "black", "white", "blue", "red", "yellow", "gray", "brown"]

function FontSelectorAndResat({ selectedFont, handleFontChange, selectedColor, handleSizeChange, selectedSize, handleColorChange, handleResetText }) {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <select onChange={handleFontChange} value={selectedFont} className="select-menu">
          {fonts.map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>

        <select onChange={handleSizeChange} value={selectedSize} className="select-menu">
          {sizes.map((size) => (
            <option key={size} value={size}>{size}px</option>
          ))}
        </select>

        <select onChange={handleColorChange} value={selectedColor} className="select-menu">
          {colors.map((color) => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>

        <button onClick={handleResetText} className="reset-button">
          🗑 איפוס טקסט
        </button>
    </div>
  );
}

export default FontSelectorAndResat;
