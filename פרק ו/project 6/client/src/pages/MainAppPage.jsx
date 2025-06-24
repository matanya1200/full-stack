import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import CommentSection from '../components/CommentSection'
import api from '../services/api'

function MainAppPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const { data } = await api.getPosts()
        setPosts(data)
      } catch (err) {
        console.error('שגיאה בקבלת פוסטים:', err)
        setError('שגיאה בטעינת הפוסטים')
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  function Post({ post, userEmail, name }) {
    const [showComments, setShowComments] = useState(false)
    const [commentsLoading, setCommentsLoading] = useState(false)

    const toggleComments = () => {
      setCommentsLoading(true)
      setShowComments(!showComments)
      // Simulate loading time for better UX
      setTimeout(() => setCommentsLoading(false), 300)
    }

    return (
      <div className="card h-100 shadow-sm border-0">
        <div className="card-body">
          {/* Post Header */}
          <div className="d-flex align-items-center mb-3">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" 
                 style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-person-fill text-white"></i>
            </div>
          </div>

          {/* Post Content */}
          <h5 className="card-title fw-bold text-primary mb-3">{post.title}</h5>
          <p className="card-text text-muted mb-4">{post.body}</p>

          {/* Post Actions */}
          <div className="d-flex justify-content-between align-items-center border-top pt-3">
            
            <button 
              className="btn btn-primary btn-sm"
              onClick={toggleComments}
              disabled={commentsLoading}
            >
              {commentsLoading ? (
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              ) : (
                <i className={`bi ${showComments ? 'bi-chat-fill' : 'bi-chat'} me-1`}></i>
              )}
              {showComments ? 'הסתר תגובות' : 'הצג תגובות'}
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-top">
              <CommentSection postId={post.id} userEmail={userEmail} name={name} />
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-4">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">טוען...</span>
              </div>
              <p className="text-muted">טוען פוסטים...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-light min-vh-100">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-5 fw-bold mb-3">
                ברוך הבא, {user.name || user.username}! 👋
              </h1>
              <p className="lead mb-4">
                גלה פוסטים מעניינים, שתף את המחשבות שלך והתחבר עם הקהילה
              </p>
              <div className="d-flex gap-2">
                <button className="btn btn-light btn-lg" onClick={() => navigate('/posts')}>
                  <i className="bi bi-plus-circle me-2"></i>
                  צור פוסט חדש
                </button>
                <button className="btn btn-outline-light btn-lg" onClick={() => navigate('/todos')}>
                  <i className="bi bi-check2-square me-2"></i>
                  המשימות שלי
                </button>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <i className="bi bi-chat-square-heart" style={{ fontSize: '8rem', opacity: '0.3' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="container py-5">
        {/* Section Header */}
        <div className="row mb-4">
          <div className="col-md-8">
            <h2 className="fw-bold mb-2">
              <i className="bi bi-journal-text text-primary me-2"></i>
              כל הפוסטים
            </h2>
            <p className="text-muted">עדכונים ופוסטים מהקהילה שלנו</p>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>{error}</div>
          </div>
        )}

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-5">
            <i className="bi bi-journal-x text-muted mb-3" style={{ fontSize: '4rem' }}></i>
            <h4 className="text-muted mb-3">אין פוסטים להצגה</h4>
            <p className="text-muted mb-4">נראה שעדיין לא נוספו פוסטים למערכת</p>
            <button className="btn btn-primary" onClick={() => navigate('/posts')}>
              <i className="bi bi-plus-circle me-2"></i>
              צור את הפוסט הראשון
            </button>
          </div>
        ) : (
          <div className="row g-4">
            {posts.map(post => (
              <div key={post.id} className="col-lg-6 col-xl-4">
                <Post post={post} userEmail={user?.email} name={user.username} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5>המערכת שלי</h5>
              <p>פלטפורמה לשיתוף תוכן ותקשורת</p>
            </div>
            <div className="col-md-6 text-end">
              <p className="mb-0">
                © 2024 כל הזכויות שמורות
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default MainAppPage