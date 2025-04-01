import React from "react";

const Toolbar = ({ createNewText, openTextFromStorage }) => {
  return (
    <div>
      <button onClick={createNewText}>+ יצירת טקסט חדש</button>
      <button onClick={openTextFromStorage}>📂 Open File</button>
    </div>
  );
};

export default Toolbar;
