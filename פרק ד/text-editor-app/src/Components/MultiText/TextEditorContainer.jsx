import React from "react";
import DisplayTextEditor from "../TextEdit/DisplayTextEditor";
import StorageManager from "../Storage/StorageManager";

const TextEditorContainer = ({
  activeText,
  texts,
  setTexts,
  activeTextId,
  setFont,
  setSize,
  setColor,
  selectedFont,
  selectedSize,
  selectedColor,
  cursorPos,
  setCursorPos,
  addCharToText,
  activeUserName,
  closeText
}) => {
  if (!activeText) return null; // אם אין טקסט פעיל, אל תציג כלום

  return (
    <>
      <DisplayTextEditor 
        text={activeText.content}
        setText={(newContent) => {
          const updatedTexts = texts.map((text) =>
            text.id === activeTextId ? { ...text, content: newContent } : text
          );
          setTexts(updatedTexts);
        }}
        selectedFont={selectedFont}
        setFont={setFont}
        selectedSize={selectedSize}
        setSize={setSize}
        selectedColor={selectedColor}
        setColor={setColor}
      />

      <StorageManager 
        activeTextId={activeTextId}
        text={activeText.content}
        selectedFont={selectedFont}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        activeUserName={activeUserName}
        cursorPos={cursorPos}
        closeText={closeText}
      />
    </>
  );
};

export default TextEditorContainer;
