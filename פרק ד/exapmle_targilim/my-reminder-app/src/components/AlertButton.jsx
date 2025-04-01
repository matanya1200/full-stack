import React, { useState } from "react";

export default function AlertButton() {
    const messages = ["יום נפלא!", "אל תשכח לחייך!", "אתה עושה עבודה מצוינת!"];
    const [index, setIndex] = useState(0);

    function showAlert() {
        alert(messages[index]);
        setIndex((index + 1) % messages.length);
    }

    return (
        <div className="alert-button">
            <h2>הודעה יומית</h2>
            <button onClick={showAlert}>הצג הודעה</button>
        </div>
    );
}
