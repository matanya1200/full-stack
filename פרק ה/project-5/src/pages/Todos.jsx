import { useEffect, useState } from "react";
import {useParams} from "react-router-dom"
import {getTodos, addTodoServer, updateTodo, deleteTodoServer, updateTodoTitel} from "../API/todosService";
import "../CSS/todos.css";

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
    getTodos(user.id)
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
    await updateTodo(id, { completed: !completed });
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !completed } : t));
  };

  // Update title
  const updateTitle = async (id, title) => {
    const newTitle = prompt("הכנס כותרת חדשה:", title);
    if (newTitle && newTitle !== title) {
      await updateTodoTitel(id, newTitle);
      setTodos(todos.map(t => t.id === id ? { ...t, title: newTitle } : t));
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await deleteTodoServer(id);
    setTodos(todos.filter(t => t.id !== id));
  };

  // Add new todo
  const addTodo = async () => {
    if (!newTitle.trim()) return;
    const data = await addTodoServer(user.id, newTitle);
    setTodos([...todos, data]);
    setNewTitle("");
  };

return (
  <div className="table-scroll">
    <div className="todos-wrapper">
      <h3 className="todos-title">רשימת המשימות</h3>

      <div className="todos-add">
        <input
          className="todos-input"
          placeholder="הוסף משימה חדשה..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button className="todos-btn" onClick={addTodo}>הוסף</button>
      </div>

      <div className="todos-filter">
        <label>סינון: </label>
        <input
          className="todos-input"
          placeholder="חפש לפי id / כותרת / מצב"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="todos-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="id">לפי ID</option>
          <option value="title">לפי כותרת</option>
          <option value="completed">לפי מצב</option>
        </select>
      </div>
        <table className="todos-table" border="1" cellPadding="6">
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
              <tr key={todo.id} className={todo.completed ? "todo-row completed" : "todo-row"}>
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
                  <button className="action-btn update" onClick={() => updateTitle(todo.id, todo.title)}>עדכן</button>{" "}
                  <button className="action-btn delete" onClick={() => deleteTodo(todo.id)}>מחק</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Todos;
