import React from "react";
import DisplayTextEditor from "../DisplayTextEditor";
import StorageManager from "../StorageManager";
import VirtualKeyboard from "../VirtualKeyboard";

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
  openTextFromStorage,
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
        text={activeText.content}
        setText={(newContent) => {
          const updatedTexts = texts.map((text) =>
            text.id === activeTextId ? { ...text, content: newContent } : text
          );
          setTexts(updatedTexts);
        }}
        selectedFont={selectedFont}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        setFont={setFont}
        setSize={setSize}
        setColor={setColor}
        openText={openTextFromStorage}
      />

      <VirtualKeyboard 
        text={activeText.content}
        setText={(newContent) => {
          const updatedTexts = texts.map((text) =>
            text.id === activeTextId ? { ...text, content: newContent } : text
          );
          setTexts(updatedTexts);
        }}
        cursorPos={cursorPos} 
        setCursorPos={setCursorPos} 
        addCharToText={addCharToText}
      />
    </>
  );
};

export default TextEditorContainer;
