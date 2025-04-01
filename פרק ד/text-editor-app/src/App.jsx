import React, { useState } from "react";
import Toolbar from "./Components/MultiText/Toolbar";
import TextTabs from "./Components/MultiText/TextTabs";
import TextEditorContainer from "./Components/MultiText/TextEditorContainer";

function App() {
  const [texts, setTexts] = useState([]);
  const [activeTextId, setActiveTextId] = useState(null);
  const [cursorPos, setCursorPos] = useState(0);
  const [selectedFont, setFont] = useState("Arial");
  const [selectedSize, setSize] = useState(16);
  const [selectedColor, setColor] = useState("black");

  const createNewText = () => {
    const newText = {
      id: Date.now(),
      content: [],
      font: selectedFont,
      size: selectedSize,
      color: selectedColor,
    };
    setTexts([...texts, newText]);
    setActiveTextId(newText.id);
  };

  const openTextFromStorage = () => {
    const name = prompt("הזן שם קובץ לפתיחה:");
    if (!name || !localStorage.getItem(name)) {
      alert("קובץ לא נמצא!");
      return;
    }
    const savedContent = JSON.parse(localStorage.getItem(name));

    const newText = {
      id: Date.now(),
      name,
      content: savedContent.text,
      font: savedContent.style.font,
      size: savedContent.style.size,
      color: savedContent.style.color,
    };

    setTexts([...texts, newText]);
    setActiveTextId(newText.id);
  };

  const closeText = (id) => {
    if (window.confirm("האם ברצונך לשמור את הטקסט?")) {
      const fileName = prompt("הזן שם לקובץ:");
      if (fileName) {
        localStorage.setItem(fileName, JSON.stringify({
          text: texts.find(text => text.id === id).content,
          style: { font: selectedFont, size: selectedSize, color: selectedColor }
        }));
        alert("הטקסט נשמר בהצלחה!");
      }
    }
    setTexts(texts.filter(text => text.id !== id));
    setActiveTextId(null);
  };

  const addCharToText = (char) => {
    const newChar = { char, font: selectedFont, size: selectedSize, color: selectedColor };
    setTexts(texts.map(text =>
      text.id === activeTextId ? { ...text, content: [...text.content, newChar] } : text
    ));
  };

  const activeText = texts.find(text => text.id === activeTextId);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>🎨 עורך טקסט מתקדם</h1>
      <Toolbar createNewText={createNewText} openTextFromStorage={openTextFromStorage} />
      <TextTabs texts={texts} activeTextId={activeTextId} setActiveTextId={setActiveTextId} closeText={closeText} />
      <TextEditorContainer {...{ activeText, texts, setTexts, activeTextId, setFont, setSize, setColor, selectedFont, selectedSize, selectedColor, cursorPos, setCursorPos, addCharToText, openTextFromStorage }} />
    </div>
  );
}

export default App;
