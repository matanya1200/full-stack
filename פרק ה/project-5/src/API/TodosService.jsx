const BASE_URL = "http://localhost:3001";

export const getTodos = async (userId) => {
  const res = await fetch(`${BASE_URL}/todos?userId=${userId}`);
  return res.json();
};

export const addTodoServer = async (userId, title) => {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, title, completed: false }),
  });
  return res.json();
};

export const updateTodo = async (id, updates) => {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
};

export const updateTodoTitel = async (id, newTitle) => {
    const res = await fetch(`${BASE_URL}/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    });
};

export const deleteTodoServer = async (id) => {
  await fetch(`${BASE_URL}/todos/${id}`, { method: "DELETE" });
};
