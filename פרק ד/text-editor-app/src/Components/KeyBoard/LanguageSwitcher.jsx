import React from "react";

function LanguageSwitcher({ layout, switchLayout }) {
  return (
    <button className="switch-layout" onClick={switchLayout}>
        🔄 שינוי שפה ({layout})
    </button>
  );
}

export default LanguageSwitcher;
