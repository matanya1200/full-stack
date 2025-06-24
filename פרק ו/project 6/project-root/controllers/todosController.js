const db = require('../db');

// GET /todos
exports.getAllTodos = async (req, res) => {
  try {
    const { user_id, completed } = req.query;

    let query = 'SELECT * FROM todos';
    let params = [];

    if (user_id) {
      query += ' WHERE user_id = ?';
      params.push(user_id);
    }

    if (completed !== undefined) {
      query += params.length ? ' AND' : ' WHERE';
      query += ' completed = ?';
      params.push(completed === 'true'); // הופך מ-string ל-boolean
    }

    const [rows] = await db.query(query, params);
    res.status(200).json(rows);

  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// GET /todos/:id
exports.getTodoById = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM todos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Todo not found' });
    res.status(200).json(rows[0]);
  }catch (error) {
    res.status(500).json({ message: 'Failed to fetch todo', error: error.message });
  }
};

// POST /todos
exports.createTodo = async (req, res) => {
  try{
    const { user_id, title, completed = false } = req.body;

    if (!user_id || !title) {
        return res.status(400).json({ message: 'user_id and title are required' });
    }

    const [result] = await db.query(
        'INSERT INTO todos (user_id, title, completed) VALUES (?, ?, ?)',
        [user_id, title, completed]
    );

    res.status(201).json({
        id: result.insertId,
        user_id,
        title,
        completed
    });
  }catch (error) {
    res.status(500).json({ message: 'Failed to create tode', error: error.message });
  }
};

// PUT /todos/:id
exports.updateTodo = async (req, res) => {
  try{
    const { title, completed } = req.body;
    const todoId = req.params.id;

    const [result] = await db.query(
        'UPDATE todos SET title = ?, completed = ? WHERE id = ?',
        [title, completed, todoId]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Todo not found' });

    res.status(200).json({ message: 'Todo updated' });
  }catch (error) {
    res.status(500).json({ message: 'Failed to update todo', error: error.message });
  }
};

// DELETE /todos/:id
exports.deleteTodo = async (req, res) => {
  try{
    const [result] = await db.query('DELETE FROM todos WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Todo not found' });

    res.status(200).json({ message: 'Todo deleted' });
  }catch (error) {
    res.status(500).json({ message: 'Failed to delete todo', error: error.message });
  }
};
