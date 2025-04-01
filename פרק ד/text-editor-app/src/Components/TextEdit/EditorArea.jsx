import React from "react";

function EditorArea({ text, handleInput, highlightText, searchTerm, selectedFont, selectedSize, selectedColor}) {

  return (
    <div
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{
          width: "80%",
          minHeight: "150px",
          fontSize: `${selectedSize}px`,
          fontFamily: selectedFont,
          color: selectedColor,
          border: "1px solid black",
          padding: "10px",
          whiteSpace: "pre-wrap",
        }}
      >
        {highlightText(text, searchTerm)}
      </div>
  );
}

export default EditorArea;
