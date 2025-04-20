import React, { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher"
import KeyboardLayout from "./KeyboardLayout";
import KeyboardControls from "./KeyboardControls";
import "../Styles/VirtualKeyboard.css";

function VirtualKeyboard({ text, setText, cursorPos, setCursorPos, addCharToText }) {

  const layouts = {
    english: [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ.,!?"],
    english_lower: [..."abcdefghijklmnopqrstuvwxyz.,!?"],
    hebrew: [..."אבגדהוזחטיכלמנסעפצקרשתםןץףך.,!?"],
    emojis:  ["😀", "😂", "😍", "🥳", "😎", "😢", "😡", "👍", "👎", "🙏",
        "❤️", "🔥", "🎉", "💯", "💡", "🎵", "🌍", "🚀", "⚽", "🏆"],
    numbers: [..."1234567890+-*/=()&%@#$![]{}"]
  };
  
  const [layout, setLayout] = useState("english");

  const handleKeyClick = (char) => {
    addCharToText(char);
  };  

  const handleBackspace = () => {
    if (cursorPos > 0) {
      const newText = [...text.slice(0, cursorPos - 1), ...text.slice(cursorPos)];
      setText(newText);
      setCursorPos(cursorPos - 1);
    }
  };
  
  const handleEnter = () => {
    addCharToText("\n"); // הכנסת תו ירידת שורה במיקום הסמן
  };
  
  const moveCursorLeft = () => {
    setCursorPos(Math.max(0, cursorPos - 1));
  };

  const moveCursorRight = () => {
    setCursorPos(Math.min(text.length, cursorPos + 1));
  };

  const switchLayout = () => {
    const layoutsArray = Object.keys(layouts);
    const nextIndex = (layoutsArray.indexOf(layout) + 1) % layoutsArray.length;
    setLayout(layoutsArray[nextIndex]);
  };

  return (
    <div className="keyboard-container">

      <LanguageSwitcher layout={layout} switchLayout={switchLayout} />

      <KeyboardLayout layouts={layouts} layout={layout} handleKeyClick={handleKeyClick} />

      <KeyboardControls handleBackspace={handleBackspace} handleEnter={handleEnter}
       moveCursorLeft={moveCursorLeft} moveCursorRight={moveCursorRight} handleKeyClick={handleKeyClick}/>

    </div>
  );
}

export default VirtualKeyboard;
