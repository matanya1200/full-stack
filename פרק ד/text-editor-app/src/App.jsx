import React, { useState } from "react";
import Toolbar from "./Components/MultiText/Toolbar";
import TextTabs from "./Components/MultiText/TextTabs";
import TextEditorContainer from "./Components/MultiText/TextEditorContainer";

function App() {
  const [texts, setTexts] = useState([]);
  const [activeUserName, setActiveUserName] = useState(""); // התחל כערך ריק
  const [enteredUserName, setEnteredUserName] = useState(""); // שם משתמש מהאינפוט
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
      owner: activeUserName,
    };
    setTexts([...texts, newText]);
    setActiveTextId(newText.id);
    setCursorPos(0);
  };

  const addCharToText = (char) => {
    const newChar = { char, font: selectedFont, size: selectedSize, color: selectedColor };
    setTexts(texts.map(text => {
      if (text.id !== activeTextId) return text;

      const before = text.content.slice(0, cursorPos);
      const after = text.content.slice(cursorPos);

      return {
        ...text,
        content: [...before, newChar, ...after]
      };
    }
    ));
    setCursorPos(cursorPos + 1)
  };

  const activeText = texts.find(text => text.id === activeTextId);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1>🎨 עורך טקסט מתקדם</h1>

      {!activeUserName ? (
        <>
          <input 
            type="text" 
            value={enteredUserName} 
            onChange={(e) => setEnteredUserName(e.target.value)} 
            placeholder="הזן שם משתמש"
          />
          <button onClick={() => setActiveUserName(enteredUserName)}>כניסה למערכת</button>
        </>
      ) : (
        <>
          <h2>שלום, {activeUserName}!</h2>
          <Toolbar texts={texts} createNewText={createNewText} activeUserName={activeUserName} setTexts={setTexts} />
          <TextTabs texts={texts} activeTextId={activeTextId} setActiveTextId={setActiveTextId} setTexts={setTexts} />
          <TextEditorContainer {...{ activeText, texts, setTexts, activeTextId, setFont, setSize, setColor, selectedFont,
             selectedSize, selectedColor, cursorPos, setCursorPos, addCharToText, activeUserName }} />
        </>
      )}
    </div>
  );
}

export default App;
