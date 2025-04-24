import React, { useState } from "react";
import SearchBar from "./SearchBar";
import EditorArea from "./EditorArea";
import "../Styles/DisplayTextEditor.css";

function DisplayTextEditor({ text, setText, selectedFont, setFont, selectedSize, setSize, selectedColor, setColor }) {
  
  const [searchTerm, setSearchTerm] = useState("");
  
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
      <button onClick={handleResetText} className="reset-button">
          🗑 איפוס טקסט
      </button>

    </div>
  );
}

export default DisplayTextEditor;