import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchPosts,
  createPost,
  updatePostServer,
  deletePostServer
} from "../API/postsService";
import "../CSS/posts.css";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';


function PostsList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");

  useEffect(() => {
    fetchPosts().then(setPosts);
  }, [user.id]);

  const filtered = posts.filter(
    p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toString() === search
  );

  const addPost = async () => {
    if (!newTitle || !newBody) return;
    const newPost = await createPost(id, newTitle, newBody);
    if (!newPost) {
      toast.error("שגיאה בהוספת הפוסט");
      return;
    }
    toast.success("הפוסט נוסף בהצלחה!");
    setPosts([...posts, newPost]);
    setNewTitle("");
    setNewBody("");
  };

  const deletePost = async (postId) => {
    await deletePostServer(postId);
    if (!postId) {
      toast.error("שגיאה במחיקת הפוסט");
      return;
    }
    setPosts(posts.filter(p => p.id !== postId));
    toast.success("הפוסט נמחק בהצלחה!");
  };

  const updatePost = async (id, oldTitle, oldBody) => {
    const { value: title } = await Swal.fire({
      title: 'כותרת חדשה',
      input: 'text',
      inputLabel: 'כתוב כותרת חדשה',
      inputValue: oldTitle,
      showCancelButton: true,
      confirmButtonText: 'עדכן',
      cancelButtonText: 'ביטול',
    });
      const { value: body } = await Swal.fire({
      title: 'תוכן חדש',
      input: 'text',
      inputLabel: 'כתוב תוכן חדש',
      inputValue: oldBody,
      showCancelButton: true,
      confirmButtonText: 'עדכן',
      cancelButtonText: 'ביטול',
    });
  if (title && body) {
    try {
      await updatePostServer(id, title, body);
      setPosts(posts.map(p => (p.id === id ? { ...p, title, body } : p)));
      toast.success("הפוסט עודכן בהצלחה!");
    } catch (err) {
      toast.error("שגיאה בעדכון הפוסט");
    }
  }
};


  const selectPost = (post) => {
    navigate(`/home/users/${user.id}/posts/${post.id}`);
  };

  return (
    <div className="posts-wrapper">
      <h3 className="posts-title">רשימת הפוסטים</h3>

      <div className="posts-filter">
        <input
          className="posts-input"
          placeholder="חפש לפי כותרת או ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="posts-add">
        <input
          className="posts-input"
          placeholder="כותרת חדשה"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input
          className="posts-input"
          placeholder="תוכן חדש"
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
        />
        <button className="posts-btn" onClick={addPost}>הוסף פוסט</button>
      </div>

      <ul className="posts-list">
        {filtered.map(post => (
          <li key={post.id} className="post-item">
            <div className="post-info">
              <strong>{post.id}</strong>: {post.title}
            </div>
            <div className="post-actions">
              <button className="posts-btn" onClick={() => selectPost(post)}>פתח</button>
              {post.userId == id && (
                <>
                  <button className="posts-btn update" onClick={() => updatePost(post.id, post.title, post.body)}>עדכן</button>
                  <button className="posts-btn delete" onClick={() => deletePost(post.id)}>מחק</button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostsList;
