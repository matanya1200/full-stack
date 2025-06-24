import { useEffect, useState } from 'react'
import api from '../services/api'

export default function CommentSection({ postId, userEmail, name }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.getCommentsByPost(postId).then(res => setComments(res.data))
  }, [postId])

  const handleAdd = async () => {
    if (!newComment.trim()) return
    
    setLoading(true)
    try {
      await api.addComment(postId, {
        name: name,
        email: userEmail,
        body: newComment
      })
      setNewComment('')
      const res = await api.getCommentsByPost(postId)
      setComments(res.data)
    } catch (err) {
      console.error('שגיאה בהוספת תגובה:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (commentId, email) => {
    if (email !== userEmail) return
    
    if (window.confirm('האם אתה בטוח שברצונך למחוק את התגובה?')) {
      try {
        await api.deleteComment(postId, commentId, email)
        setComments(comments.filter(c => c.id !== commentId))
      } catch (err) {
        console.error('שגיאה במחיקת תגובה:', err)
      }
    }
  }

  const handleEdit = async (commentId, name, email) => {
    if (email !== userEmail) return
    
    const newBody = prompt('עדכן תגובה:')
    if (!newBody) return
    
    try {
      await api.updateComment(postId, commentId, name, newBody, email)
      const res = await api.getCommentsByPost(postId)
      setComments(res.data)
    } catch (err) {
      console.error('שגיאה בעדכון תגובה:', err)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAdd()
    }
  }

  const filteredComments = comments.filter(comment => comment.post_id == postId)

  return (
    <div className="comment-section">
      <h6 className="mb-3">
        <i className="bi bi-chat-dots me-2"></i>
        תגובות ({filteredComments.length})
      </h6>
      
      {/* רשימת התגובות */}
      <div className="comments-list mb-3" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {filteredComments.length === 0 ? (
          <p className="text-muted fst-italic">אין תגובות עדיין. היה הראשון להגיב!</p>
        ) : (
          filteredComments.map(comment => (
            <div key={comment.id} className="comment-item p-3 mb-2 bg-light rounded">
              <div className="d-flex justify-content-between align-items-start">
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-person-circle text-primary me-2"></i>
                    <strong className="text-primary">{comment.name}</strong>
                    {comment.email === userEmail && (
                      <span className="badge bg-success ms-2">אתה</span>
                    )}
                  </div>
                  <p className="mb-1">{comment.body}</p>
                </div>
                
                {comment.email === userEmail && (
                  <div className="comment-actions ms-2">
                    <button
                      className="btn btn-outline-primary btn-sm me-1"
                      onClick={() => handleEdit(comment.id, comment.name, comment.email)}
                      title="ערוך תגובה"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleDelete(comment.id, comment.email)}
                      title="מחק תגובה"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* טופס הוספת תגובה */}
      <div className="add-comment-form">
        <div className="input-group">
          <textarea
            className="form-control"
            placeholder="הוסף תגובה..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="2"
            style={{ resize: 'none' }}
          />
          <button 
            className="btn btn-primary"
            onClick={handleAdd}
            disabled={!newComment.trim() || loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                שולח...
              </>
            ) : (
              <>
                <i className="bi bi-send me-1"></i>
                שלח
              </>
            )}
          </button>
        </div>
        <small className="text-muted">לחץ Enter לשליחה או Shift+Enter לשורה חדשה</small>
      </div>
    </div>
  )
}