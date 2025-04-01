import React, { useState } from "react";
import List from "./components/TaskList.jsx";
import Clock from "./components/Clock.jsx";
import AlertButton from "./components/AlertButton.jsx";
import "./app.css";

export default function App() {
    const [username, setUsername] = useState("");

    // אתגר - קבלת שם משתמש
    if (!username) {
        const enteredName = prompt("מה שמך?");
        setUsername(enteredName || "משתמש");
    }

    return (
        <div className="app">
            <h1>מזכיר אישי - ברוך הבא {username}!</h1>
            <div className="container">
                <List />
                <Clock />
                <AlertButton />
            </div>
        </div>
    );
}
