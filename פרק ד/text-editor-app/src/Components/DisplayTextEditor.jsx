import React, { useState } from "react";
import FontSelectorAndResat from "./TextEdit/FontSelectorAndResat";
import SearchBar from "./TextEdit/SearchBar";
import EditorArea from "./TextEdit/EditorArea";
import "./Styles/DisplayTextEditor.css";

function DisplayTextEditor({ text, setText, selectedFont, setFont, selectedSize, setSize, selectedColor, setColor }) {
  
  const [searchTerm, setSearchTerm] = useState("");
  const handleFontChange = (event) => setFont(event.target.value);
  const handleSizeChange = (event) => setSize(parseInt(event.target.value, 10));
  const handleColorChange = (event) => setColor(event.target.value);
  const handleResetText = () => setText([]);

  const handleInput = (e) => {
    const newText = e.currentTarget.textContent.split("").map((char) => ({
      char,
      font: selectedFont,
      size: selectedSize,
      color: selectedColor,
    }));
    setText(newText);
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm.trim())
      return text.map((item, index) => (
        <span key={index} style={{ fontFamily: item.font, fontSize: `${item.size}px`, color: item.color }}>
          {item.char}
        </span>
    ));

    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.map((item, index) => {
      const parts = item.char.split(regex).map((part, partIndex) => 
        regex.test(part) ? (
          <span key={`${index}-${partIndex}`} style={{ backgroundColor: "yellow", fontFamily: item.font, fontSize: `${item.size}px`, color: item.color }}>
            {part}
          </span>
        ) : (
          <span key={`${index}-${partIndex}`} style={{ fontFamily: item.font, fontSize: `${item.size}px`, color: item.color }}>
            {part}
          </span>
        )
      );

      return <span key={index}>{parts}</span>;
    });
  };

  return (
    <div className="editor-container">

      {/* תפריטים נפתחים לבחירת גופן וגודל טקסט */}

      <FontSelectorAndResat
        selectedFont={selectedFont}
        handleFontChange={handleFontChange}
        selectedSize={selectedSize}
        handleSizeChange={handleSizeChange}
        selectedColor={selectedColor}
        handleColorChange={handleColorChange}
        handleResetText={handleResetText}
      />

      {/*שדה חיפוש תו */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* אזור העריכה */}

      <EditorArea
        text={text}
        handleInput={handleInput}
        highlightText={highlightText}
        searchTerm={searchTerm}
        selectedFont={selectedFont}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
      />

    </div>
  );
}

export default DisplayTextEditor;