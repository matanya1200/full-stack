const BASE_URL = "http://localhost:3001";

export const fetchPosts = async () => {
  const res = await fetch(`${BASE_URL}/posts`);
  return res.json();
};

export const createPost = async (userId, title, body) => {
  const res = await fetch(`${BASE_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, title, body }),
  });
  return res.json();
};

export const updatePostServer = async (id, title, body) => {
  await fetch(`${BASE_URL}/posts/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, body }),
  });
};

export const deletePostServer = async (id) => {
  await fetch(`${BASE_URL}/posts/${id}`, { method: "DELETE" });
};

export const fetchComments = async (postId) => {
  const res = await fetch(`${BASE_URL}/comments?postId=${postId}`);
  let data = await res.json();
  data = data.filter(comments => comments.postId === Number(postId) || comments.postId === postId );
  return data;
};

export const createComment = async (postId, name, email, body) => {
  const res = await fetch(`${BASE_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ postId, name, email, body }),
  });
  return res.json();
};

export const updateComment = async (id, body) => {
  await fetch(`${BASE_URL}/comments/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
};

export const deleteComment = async (id) => {
  await fetch(`${BASE_URL}/comments/${id}`, { method: "DELETE" });
};
