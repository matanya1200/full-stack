import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'

function TodosPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [todos, setTodos] = useState([])
  const [newTodo, setNewTodo] = useState('')
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')
  const [filter, setFilter] = useState('all') // 'all', 'done', 'notdone'

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    fetchTodos()
  }, [filter])

  const fetchTodos = async () => {
    try {
      let completedParam = null
      if (filter === 'done') completedParam = true
      else if (filter === 'notdone') completedParam = false

      const params = {
        user_id: user.id,
      }

      if (completedParam !== null) {
        params.completed = completedParam
      }

      const { data } = await api.getTodos({ params })
      setTodos(data)
    } catch (err) {
      console.error('Failed to fetch todos:', err)
    }
  }

  const handleAddTodo = async () => {
    if (!newTodo.trim()) return

    try {
      const { data } = await api.createTodo({
        user_id: user.id,
        title: newTodo,
        completed: false
      })
      setTodos([...todos, data])
      setNewTodo('')
      setFilter('all')
      stats = getFilterStats()
    } catch (err) {
      console.error('שגיאה בהוספת משימה:', err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את המשימה?')) {
      try {
        await api.deleteTodo(id)
        setTodos(todos.filter(t => t.id !== id))
      } catch (err) {
        console.error('שגיאה במחיקת משימה:', err)
      }
    }
  }

  const toggleComplete = async (todo) => {
    try {
      const updated = { ...todo, completed: !todo.completed }
      await api.updateTodo(todo.id, updated)
      setTodos(todos.map(t => t.id === todo.id ? updated : t))
    } catch (err) {
      console.error('שגיאה בעדכון סטטוס:', err)
    }
  }

  const startEdit = (todo) => {
    setEditId(todo.id)
    setEditText(todo.title)
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditText('')
  }

  const saveEdit = async (id) => {
    try {
      const updated = { ...todos.find(t => t.id === id), title: editText }
      await api.updateTodo(id, updated)
      setTodos(todos.map(t => t.id === id ? updated : t))
      cancelEdit()
    } catch (err) {
      console.error('שגיאה בעדכון תוכן המשימה:', err)
    }
  }

  const getFilterStats = () => {
    const total = todos.length
    const completed = todos.filter(t => t.completed).length
    const pending = total - completed
    return { total, completed, pending }
  }

  let stats = getFilterStats()

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="text-center mb-4">
              <h2>
                <i className="bi bi-check2-square me-2 text-primary"></i>
                רשימת משימות של {user?.username}
              </h2>
            </div>

            {/* סטטיסטיקות */}
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card text-center bg-primary text-white">
                  <div className="card-body">
                    <h5 className="card-title">{stats.total}</h5>
                    <p className="card-text">סה"כ משימות</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center bg-success text-white">
                  <div className="card-body">
                    <h5 className="card-title">{stats.completed}</h5>
                    <p className="card-text">הושלמו</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card text-center bg-warning text-white">
                  <div className="card-body">
                    <h5 className="card-title">{stats.pending}</h5>
                    <p className="card-text">ממתינות</p>
                  </div>
                </div>
              </div>
            </div>

            {/* פילטר */}
            <div className="card mb-4">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <label htmlFor="filter" className="form-label">
                      <i className="bi bi-funnel me-2"></i>
                      סנן לפי מצב:
                    </label>
                    <select
                      id="filter"
                      className="form-select"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">הכל</option>
                      <option value="done">נגמר</option>
                      <option value="notdone">ממתינות</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <div className="d-flex gap-2 mt-3 mt-md-0">
                      <button 
                        className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setFilter('all')}
                      >
                        הכל
                      </button>
                      <button 
                        className={`btn ${filter === 'done' ? 'btn-success' : 'btn-outline-success'}`}
                        onClick={() => setFilter('done')}
                      >
                        הושלמו
                      </button>
                      <button 
                        className={`btn ${filter === 'notdone' ? 'btn-warning' : 'btn-outline-warning'}`}
                        onClick={() => setFilter('notdone')}
                      >
                        ממתינות
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* הוספת משימה חדשה */}
            <div className="card mb-4">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  <i className="bi bi-plus-circle me-2"></i>
                  הוסף משימה חדשה
                </h5>
              </div>
              <div className="card-body">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="הזן משימה חדשה..."
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                  />
                  <button 
                    className="btn btn-success"
                    onClick={handleAddTodo}
                    disabled={!newTodo.trim()}
                  >
                    <i className="bi bi-plus me-1"></i>
                    הוסף
                  </button>
                </div>
              </div>
            </div>

            {/* רשימת המשימות */}
            {todos.length === 0 ? (
              <div className="alert alert-info text-center">
                <i className="bi bi-info-circle me-2"></i>
                {filter === 'all' ? 'אין משימות להצגה.' : 
                 filter === 'done' ? 'אין משימות שהושלמו.' : 
                 'אין משימות ממתינות.'}
              </div>
            ) : (
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    המשימות שלך ({todos.length})
                  </h5>
                </div>
                <div className="list-group list-group-flush">
                  {todos.map(todo => (
                    <div key={todo.id} className="list-group-item">
                      {editId === todo.id ? (
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="text"
                            className="form-control"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && saveEdit(todo.id)}
                            autoFocus
                          />
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => saveEdit(todo.id)}
                            disabled={!editText.trim()}
                          >
                            <i className="bi bi-check"></i>
                          </button>
                          <button 
                            className="btn btn-secondary btn-sm"
                            onClick={cancelEdit}
                          >
                            <i className="bi bi-x"></i>
                          </button>
                        </div>
                      ) : (
                        <div className="d-flex align-items-center justify-content-between">
                          <div className="d-flex align-items-center flex-grow-1">
                            <input
                              type="checkbox"
                              className="form-check-input me-3"
                              checked={todo.completed}
                              onChange={() => toggleComplete(todo)}
                            />
                            <span
                              className={`flex-grow-1 ${todo.completed ? 'text-decoration-line-through text-muted' : ''}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => toggleComplete(todo)}
                            >
                              {todo.title}
                            </span>
                            {!(!todo.completed) && (
                              <span className="badge bg-success ms-2">הושלם</span>
                            )}
                            {!todo.completed && (
                              <span className="badge bg-warning ms-2">ממתין</span>
                            )}
                          </div>
                          <div className="d-flex gap-1">
                            <button 
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => startEdit(todo)}
                              title="ערוך משימה"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button 
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleDelete(todo.id)}
                              title="מחק משימה"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TodosPage