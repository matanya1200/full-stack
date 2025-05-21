import { useEffect, useState } from "react";
import {useParams} from "react-router-dom"

function Posts() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch(`http://localhost:3001/posts`)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, [user.id]);

  const filtered = posts.filter(
    p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toString() === search
  );

  const addPost = async () => {
    if (!newTitle || !newBody) return;
    const res = await fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: id, title: newTitle, body: newBody }),
    });
    const data = await res.json();
    setPosts([...posts, data]);
    setNewTitle("");
    setNewBody("");
  };

  const deletePost = async (id) => {
    await fetch(`http://localhost:3001/posts/${id}`, { method: "DELETE" });
    setPosts(posts.filter(p => p.id !== id));
    if (selectedPost?.id === id) {
      setSelectedPost(null);
      setComments([]);
    }
  };

  const updatePost = async (id, oldTitle, oldBody) => {
    const title = prompt("כותרת חדשה:", oldTitle);
    const body = prompt("תוכן חדש:", oldBody);
    if (title && body) {
      await fetch(`http://localhost:3001/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      setPosts(posts.map(p => (p.id === id ? { ...p, title, body } : p)));
      if (selectedPost?.id === id) setSelectedPost({ ...selectedPost, title, body });
    }
  };

  const selectPost = (post) => {
    setSelectedPost(post);
    setComments([]);
  };

  const loadComments = async (postId) => {
    const res = await fetch(`http://localhost:3001/comments?postId=${postId}`);
    const data = await res.json();
    setComments(data);
  };

  const addComment = async () => {
    if (!newComment.trim() || !selectedPost) return;
    const res = await fetch(`http://localhost:3001/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        postId: selectedPost.id,
        name: user.username,
        email: user.email,
        body: newComment,
      }),
    });
    const data = await res.json();
    setComments([...comments, data]);
    setNewComment("");
  };

  const deleteComment = async (id, ownerEmail) => {
    if (ownerEmail !== user.email) return;
    await fetch(`http://localhost:3001/comments/${id}`, { method: "DELETE" });
    setComments(comments.filter(c => c.id !== id));
  };

  const updateComment = async (id, oldText, ownerEmail) => {
    if (ownerEmail !== user.email) return;
    const body = prompt("עדכן תגובה:", oldText);
    if (body && body !== oldText) {
      await fetch(`http://localhost:3001/comments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      setComments(comments.map(c => (c.id === id ? { ...c, body } : c)));
    }
  };

  return (
    <div>
      <h3>רשימת הפוסטים</h3>

      <input
        placeholder="חפש לפי כותרת או ID"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ marginTop: "10px", marginBottom: "10px"}}>
        <input
          placeholder="כותרת חדשה"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <input style={{marginLeft: "5px" }}
          placeholder="תוכן חדש"
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
        />
        <button onClick={addPost}>הוסף פוסט</button>
      </div>

      {selectedPost && (
        <div style={{ border: "1px solid black", padding: 10, marginTop: 20 }}>
          <h4>פוסט נבחר</h4>
          <h5>{selectedPost.title}</h5>
          <p>{selectedPost.body}</p>

          <button onClick={() => loadComments(selectedPost.id)}>הצג תגובות</button>

          {comments.length > 0 && (
            <div style={{ marginTop: 10 }}>
              <h5>תגובות:</h5>
              <ul>
                {comments.map(c => (
                  <li key={c.id}>
                    {c.email}{": "}{c.body}{" "}
                    {c.email == user.email && (
                      <>
                        <button onClick={() => updateComment(c.id, c.body, c.email)}>עדכן</button>
                        <button onClick={() => deleteComment(c.id, c.email)}>מחק</button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div style={{ marginTop: 10 }}>
              <input
                placeholder="תגובה חדשה"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button onClick={addComment}>הוסף תגובה</button>
          </div>
        </div>
      )}

      <ul>
        {filtered.map(post => (
          <li key={post.id} style={{ marginTop: 10 }}>
            <strong>{post.id}</strong>: {post.title}
            <button onClick={() => selectPost(post)}>בחר</button>
            {post.userId == id && (
              <>
            <button onClick={() => updatePost(post.id, post.title, post.body)}>עדכן</button>
            <button onClick={() => deletePost(post.id)}>מחק</button>
            </>
            )}
          </li>
        ))}
      </ul>

      
    </div>
  );
}

export default Posts;
