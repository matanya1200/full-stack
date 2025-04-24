import React from "react";

const Toolbar = ({texts, createNewText, activeUserName, setTexts}) => {

  const getUserFiles = (username) => {
    const files = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      try {
        const value = JSON.parse(localStorage.getItem(key));
        if (value?.owner === username) {
          files.push(key);
        }
      } catch (e) {
        continue;
      }
    }
    return files;
  };
  

  const openTextFromStorage = () => {
    const userFiles = getUserFiles(activeUserName);

    if (userFiles.length === 0) {
      alert("אין קבצים שמורים על שם המשתמש הזה.");
      return;
    }

    const name = prompt(`בחר קובץ לפתיחה:\n${userFiles.join("\n")}`);
    if (!name || !localStorage.getItem(name)) {
      alert("קובץ לא נמצא!");
      return;
    }

    const savedContent = JSON.parse(localStorage.getItem(name));

    if (savedContent.owner !== activeUserName) {
      alert("אין לך הרשאה לפתוח קובץ זה!");
      return;
    }

    const newText = {
      id: Date.now(),
      name,
      content: savedContent.text,
      font: savedContent.style.font,
      size: savedContent.style.size,
      color: savedContent.style.color,
      owner: activeUserName,
    };

    setTexts([...texts, newText]);
    setActiveTextId(newText.id);
    setCursorPos(savedContent.cursorPos || 0);
  };

  return (
    <div>
      <button onClick={createNewText}>+ יצירת טקסט חדש</button>
      <button onClick={openTextFromStorage}>📂 Open File</button>
    </div>
  );
};

export default Toolbar;
