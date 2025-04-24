import React from "react";

const TextTabs = ({ texts, activeTextId, setActiveTextId, setTexts }) => {

  const closeText = (id) => {
    setTexts(texts.filter(text => text.id !== id));
    setActiveTextId(null);
  };

  return (
    <div>
      {texts.map((text) => (
        <div key={text.id} style={{ display: "inline-flex", alignItems: "center", margin: "5px" }}>
          <button
            onClick={() => setActiveTextId(text.id)}
            style={{ fontWeight: text.id === activeTextId ? "bold" : "normal", marginRight: "5px" }}
          >
            {text.name || `טקסט ${text.id}`}
          </button>
          <button onClick={() => closeText(text.id)}>❌</button>
        </div>
      ))}
    </div>
  );
};

export default TextTabs;
