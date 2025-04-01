import React, { useState } from "react";

export default function TaskList() {
    const [tasks, setTasks] = useState(["לקנות חלב", "לשלוח מייל", "לקרוא ספר"]);
    const [newTask, setNewTask] = useState("");

    // הוספת משימה חדשה
    function addTask() {
        if (newTask.trim() === "") return;
        setTasks([...tasks, newTask]);
        setNewTask(""); // איפוס שדה הקלט
    }

    return (
        <div className="list">
            <h2>רשימת משימות</h2>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index}>
                        <input type="checkbox" /> {task}
                    </li>
                ))}
            </ul>
            <input
                type="text"
                placeholder="הוסף משימה..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={addTask}>➕ הוסף</button>
        </div>
    );
}
