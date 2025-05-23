import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchPosts,
  fetchComments,
  createComment,
  updateComment,
  deleteComment
} from "../API/postsService";
import "../CSS/posts.css";

function PostDetails() {
  const { postId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchPosts().then(data => {
      const selected = data.find(p => p.id.toString() === postId);
      if (selected) setPost(selected);
    });
  }, [postId]);

  const loadComments = async () => {
    const data = await fetchComments(postId);
    setComments(data);
  };

  const addComment = async () => {
    if (!newComment.trim()) return;
    const data = await createComment(post.id, user.username, user.email, newComment);
    setComments([...comments, data]);
    setNewComment("");
  };

  const deleteCommentHandler = async (id, ownerEmail) => {
    if (ownerEmail !== user.email) return;
    await deleteComment(id);
    setComments(comments.filter(c => c.id !== id));
  };

  const updateCommentHandler = async (id, oldText, ownerEmail) => {
    if (ownerEmail !== user.email) return;
    const body = prompt("עדכן תגובה:", oldText);
    if (body && body !== oldText) {
      await updateComment(id, body);
      setComments(comments.map(c => (c.id === id ? { ...c, body } : c)));
    }
  };

  if (!post) return <div>טוען פוסט...</div>;

  return (
    <div className="posts-wrapper">
      <h3 className="posts-title">{post.title}</h3>
      <p>{post.body}</p>

      <button className="posts-btn" onClick={loadComments}>הצג תגובות</button>

      {comments.length > 0 && (
        <div className="comments-section">
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
      </div>
    </div>
  );
}

export default PostDetails;
