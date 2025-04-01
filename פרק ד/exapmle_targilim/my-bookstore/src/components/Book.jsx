import React from "react";

export default function Book({ key, title, author, likes, onshelf, sample, takeBook, addLike }) {
    function showSample() {
        alert(`📖 ציטוט מהספר "${title}":\n\n${sample}`);
    }
    
    return (
        <div className={`book ${onshelf ? "onshelf" : "off-shelf"}`} style={{ fontSize: likes > 100 ? "1.5em" : "1em" }}>
            <h2>📖 {key}. {title}</h2>
            <p>✍️ מחבר: {author}</p>
            <p>👍 לייקים: {likes}</p>
            <button className="read-button" onClick={showSample}>📖 Read</button>
            <button className="like-button" onClick={addLike}>❤️ Like</button>
            {onshelf && <button className="take-button" onClick={takeBook}>📦 Take</button>}
        </div>
    );
}
