import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Navbar from '../components/Navbar'
import CommentSection from '../components/CommentSection'

function PostsPage() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [posts, setPosts] = useState([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [showComments, setShowComments] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    fetchUserPosts()
  }, [])

  const fetchUserPosts = async () => {
    try {
      const { data } = await api.getPostsByUser(user.id)
      setPosts(data)
    } catch (err) {
      console.error('שגיאה בקבלת הפוסטים שלך:', err)
    }
  }

  const handleAddPost = async () => {
    if (!title || !body) return

    try {
      const { data } = await api.createPost({ user_id: user.id, title, body })
      setPosts([...posts, data])
      setTitle('')
      setBody('')
    } catch (err) {
      console.error('שגיאה בהוספת פוסט:', err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הפוסט?')) {
      try {
        await api.deletePost(id)
        setPosts(posts.filter(p => p.id !== id))
      } catch (err) {
        console.error('שגיאה במחיקת פוסט:', err)
      }
    }
  }

  const handleEdit = async (id) => {
    const updatedTitle = prompt('כותרת חדשה:')
    const updatedBody = prompt('תוכן חדש:')
    if (!updatedTitle || !updatedBody) return

    try {
      await api.updatePost(id, { title: updatedTitle, body: updatedBody })
      setPosts(posts.map(p => p.id === id ? { ...p, title: updatedTitle, body: updatedBody } : p))
    } catch (err) {
      console.error('שגיאה בעריכת פוסט:', err)
    }
  }

  function Post({ post, userEmail, name }) {
    const [showComments, setShowComments] = useState(false)

    return (
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title text-primary">{post.title}</h5>
          <p className="card-text">{post.body}</p>
          <p className="text-muted mb-3">
            <i className="bi bi-person-circle me-2"></i>
            <strong>נכתב על ידי:</strong> {post.user_name}
          </p>

          <div className="d-flex gap-2 mb-3">
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={() => handleEdit(post.id)}
            >
              <i className="bi bi-pencil me-1"></i>
              ערוך
            </button>
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={() => handleDelete(post.id)}
            >
              <i className="bi bi-trash me-1"></i>
              מחק
            </button>
            <button 
              className="btn btn-outline-info btn-sm"
              onClick={() => setShowComments(!showComments)}
            >
              <i className={`bi ${showComments ? 'bi-chat-fill' : 'bi-chat'} me-1`}></i>
              {showComments ? 'הסתר תגובות' : 'הצג תגובות'}
            </button>
          </div>

          {showComments && (
            <div className="border-top pt-3">
              <CommentSection postId={post.id} userEmail={userEmail} name={name} />
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="row">
          <div className="col-md-8 mx-auto">
            <h2 className="text-center mb-4">
              <i className="bi bi-file-text me-2"></i>
              הפוסטים שלי
            </h2>

            {/* טופס הוספת פוסט */}
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-plus-circle me-2"></i>
                  הוסף פוסט חדש
                </h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">כותרת</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    placeholder="הזן כותרת לפוסט"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="body" className="form-label">תוכן הפוסט</label>
                  <textarea
                    className="form-control"
                    id="body"
                    rows="4"
                    placeholder="כתוב את תוכן הפוסט כאן..."
                    value={body}
                    onChange={e => setBody(e.target.value)}
                  />
                </div>
                <button 
                  className="btn btn-primary"
                  onClick={handleAddPost}
                  disabled={!title || !body}
                >
                  <i className="bi bi-send me-2"></i>
                  הוסף פוסט
                </button>
              </div>
            </div>

            {/* רשימת הפוסטים */}
            {posts.length === 0 ? (
              <div className="alert alert-info text-center">
                <i className="bi bi-info-circle me-2"></i>
                אין לך פוסטים עדיין. הוסף את הפוסט הראשון שלך!
              </div>
            ) : (
              <div>
                <h4 className="mb-3">הפוסטים שלך ({posts.length})</h4>
                {posts.map(post => (
                  <Post 
                    key={post.id} 
                    post={post} 
                    userEmail={user?.email} 
                    name={user?.username}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostsPage