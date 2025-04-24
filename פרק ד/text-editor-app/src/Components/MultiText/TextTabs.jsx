import React from "react";
import TextEditorContainer from "./TextEditorContainer";

const TextTabs = ({
  setActiveTextId, 
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
}) => {

  const closeText = (id) => {
    setTexts(texts.filter(text => text.id !== id));
    setActiveTextId(null);
  };

  return (
    <div>
      {texts.map((text) => (
        <div key={text.id} style={{ display: "inline-flex", alignItems: "center", margin: "15px", border: "1px solid rgb(49, 30, 156)" , marginLeft: "25px"}}>
          <div>
            <button
              onClick={() => setActiveTextId(text.id)}
              style={{ fontWeight: text.id === activeTextId ? "bold" : "normal", marginRight: "5px" }}
            >
              {text.name || `טקסט ${text.id}`}
            </button>
            <button onClick={() => closeText(text.id)}>❌</button>
            <TextEditorContainer {...{ activeText : text, texts, setTexts, activeTextId : text.id, setFont, setSize, setColor, selectedFont,
              selectedSize, selectedColor, cursorPos, setCursorPos, addCharToText, activeUserName, closeText }} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TextTabs;
