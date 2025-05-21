import { useEffect, useState } from "react";
import {useParams} from "react-router-dom"

function Todos() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [todos, setTodos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");

  // Load todos on mount
  useEffect(() => {
    fetch(`http://localhost:3001/todos?userId=${id}`)
      .then(res => res.json())
      .then(data => {
        setTodos(data);
        setFiltered(data);
      });
  }, [user.id]);

  // Handle sorting and filtering
  useEffect(() => {
    let result = [...todos];

    if (search.trim()) {
      result = result.filter(todo =>
        todo.title.toLowerCase().includes(search.toLowerCase()) ||
        todo.id.toString() === search ||
        (search.toLowerCase() === "true" && todo.completed) ||
        (search.toLowerCase() === "false" && !todo.completed)
      );
    }

    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "completed") {
      result.sort((a, b) => a.completed - b.completed);
    } else {
      result.sort((a, b) => a.id - b.id);
    }

    setFiltered(result);
  }, [todos, sortBy, search]);

  // Toggle completion
  const toggleCompletion = async (id, completed) => {
    await fetch(`http://localhost:3001/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed }),
    });
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !completed } : t));
  };

  // Update title
  const updateTitle = async (id, title) => {
    const newTitle = prompt("הכנס כותרת חדשה:", title);
    if (newTitle && newTitle !== title) {
      await fetch(`http://localhost:3001/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      setTodos(todos.map(t => t.id === id ? { ...t, title: newTitle } : t));
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await fetch(`http://localhost:3001/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter(t => t.id !== id));
  };

  // Add new todo
  const addTodo = async () => {
    if (!newTitle.trim()) return;
    const res = await fetch(`http://localhost:3001/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id, title: newTitle, completed: false }),
    });
    const data = await res.json();
    setTodos([...todos, data]);
    setNewTitle("");
  };

  return (
    <div>
      <h3>רשימת המשימות</h3>

      <div style={{ marginBottom: "10px" }}>
        <input placeholder="הוסף משימה חדשה..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
        <button onClick={addTodo}>הוסף</button>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>סינון: </label>
        <input placeholder="חפש לפי id / כותרת / מצב" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="id">לפי ID</option>
          <option value="title">לפי כותרת</option>
          <option value="completed">לפי מצב</option>
        </select>
      </div>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>ID</th>
            <th>כותרת</th>
            <th>בוצע?</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(todo => (
            <tr key={todo.id}>
              <td>{todo.id}</td>
              <td>{todo.title}</td>
              <td>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleCompletion(todo.id, todo.completed)}
                />
              </td>
              <td>
                <button onClick={() => updateTitle(todo.id, todo.title)}>עדכן</button>{" "}
                <button onClick={() => deleteTodo(todo.id)}>מחק</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Todos;
