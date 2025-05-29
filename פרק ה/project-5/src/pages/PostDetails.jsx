import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchPosts,
  fetchComments,
  createComment,
  updateComment,
  deleteComment
} from "../API/postsService";
import "../CSS/posts.css"; 
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

function PostDetails() {
  const { id, postId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [ahowComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts().then(data => {
      const selected = data.find(p => p.id.toString() === postId);
      if (selected) setPost(selected);
    });
  }, [postId]);

  const loadComments = async () => {
    const data = await fetchComments(postId);
    setComments(data);
    setShowComments(true);
  };

  const dropComments = () => {
    setShowComments(false);
  }

  const addComment = async () => {
    if (!newComment.trim()) return;
    const data = await createComment(post.id, user.username, user.email, newComment);
    if (!data) {
      toast.error("שגיאה בהוספת התגובה");
      return;
    }
    toast.success("התגובה נוספה בהצלחה!");
    setComments([...comments, data]);
    setNewComment("");
  };

  const deleteCommentHandler = async (id, ownerEmail) => {
    if (ownerEmail !== user.email) return;
    await deleteComment(id);
    if (!id) {
      toast.error("שגיאה במחיקת התגובה");
      return;
    }
    toast.success("התגובה נמחקה בהצלחה!");
    setComments(comments.filter(c => c.id !== id));
  };

  const updateCommentHandler = async (id, oldText, ownerEmail) => {
    if (ownerEmail !== user.email) return;
    const { value: body } = await Swal.fire({
      title: 'עדכון תגובה',
      input: 'text',
      inputLabel: 'כתוב טקסט חדש לתגובה',
      inputValue: oldText,
      showCancelButton: true,
      confirmButtonText: 'עדכן',
      cancelButtonText: 'ביטול',
    });
    if (body && body !== oldText) {
      await updateComment(id, body);
      if (!id) {
        toast.error("שגיאה בעדכון התגובה");
        return;
      }
      toast.success("התגובה עודכנה בהצלחה!");
      setComments(comments.map(c => (c.id === id ? { ...c, body } : c)));
    }
  };

  if (!post) return <div>טוען פוסט...</div>;

  return (
    <div className="posts-wrapper">
      <h3 className="posts-title">{post.title}</h3>
      <p>{post.body}</p>

      {!ahowComments &&
      <button className="posts-btn" onClick={loadComments}>הצג תגובות</button>}

      
      {comments.length > 0 && ahowComments && (
        <div className="comments-section">
          <button className="posts-btn" onClick={dropComments}>הסתר תגובות</button>
          <h5>תגובות:</h5>
          <ul className="comments-list">
            {comments.map(c => (
              <li key={c.id} className="comment-item">
                {c.email}{": "}{c.body}
                {c.email === user.email && (
                  <>
                    <button className="comment-btn" onClick={() => updateCommentHandler(c.id, c.body, c.email)}>עדכן</button>
                    <button className="comment-btn delete" onClick={() => deleteCommentHandler(c.id, c.email)}>מחק</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="add-comment">
        <input
          className="posts-input"
          placeholder="תגובה חדשה"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className="posts-btn" onClick={addComment}>הוסף תגובה</button>

        <button className="postss-back" onClick={()=>navigate(`/home/users/${id}/posts`)}>חזרה לפוסטים</button>
      </div>
    </div>
  );
}

export default PostDetails;
