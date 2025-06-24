import axios from 'axios'

const API_BASE = 'http://localhost:3000'

// אובייקט עם פונקציות לכל ישות
const api = {
  //user api
  login: (credentials) => axios.post(`${API_BASE}/login`, credentials),
  register: (userData) => axios.post(`${API_BASE}/register`, userData),
  getUserById: (id) => axios.get(`${API_BASE}/users/${id}`),
  
  //todo api
  getTodos: (parms) => axios.get(`${API_BASE}/todos`,parms),
  createTodo: (todo) => axios.post(`${API_BASE}/todos`, todo),
  updateTodo: (todoId, updates) => axios.put(`${API_BASE}/todos/${todoId}`, updates),
  deleteTodo: (todoId) => axios.delete(`${API_BASE}/todos/${todoId}`),

  //post api
  getPosts: () => axios.get(`${API_BASE}/posts`),//all
  getPostsByUser: (userId) => axios.get(`${API_BASE}/posts?user_id=${userId}`),//by user id
  createPost: (post) => axios.post(`${API_BASE}/posts`, post),
  updatePost: (postId, updates) => axios.put(`${API_BASE}/posts/${postId}`, updates),
  deletePost: (postId) => axios.delete(`${API_BASE}/posts/${postId}`),

  //comment api
  getCommentsByPost: (postId) => axios.get(`${API_BASE}/comments?user_id=${postId}`),
  addComment: (postId, comment) => axios.post(`${API_BASE}/posts/${postId}/comments`, comment),//הוספת תגובה לפוסט
  updateComment: (postId, commentId, name, body, email) => axios.put(`${API_BASE}/posts/${postId}/comments/${commentId}`, { "name": name, "body": body, "email": email }),//עדכון תגובה רק אם האימל נכון
  deleteComment: (postId, commentId, email) => axios.delete(`${API_BASE}/posts/${postId}/comments/${commentId}`, { data: { email } }),//מחיקת תגובה רק אם האימל נכון

  //albums api
  getAlbums: () => axios.get(`${API_BASE}/albums`),//all
  getAlbumsByUser: (userId) => axios.get(`${API_BASE}/albums?user_id=${userId}`),//by user id
  createAlbum: (album) => axios.post(`${API_BASE}/albums`, album),
  updateAlbum: (albumId, updates) => axios.put(`${API_BASE}/albums/${albumId}`, updates),
  deleteAlbum: (albumId) => axios.delete(`${API_BASE}/albums/${albumId}`),

  //photo api
  getPhotosByAlbume: (albumsId, page=1) => axios.get(`${API_BASE}/albums/${albumsId}/photos?page=${page}`),
  addPhoto: (albumsId, title, url) => axios.post(`${API_BASE}/albums/${albumsId}/photos`, { title, url}),
  updatePhoto: (albumsId, photoId, title, url) => axios.put(`${API_BASE}/albums/${albumsId}/photos/${photoId}`, { title, url}),//עדכון תגובה רק אם האימל נכון
  deletePhoto: (albumsId, photoId) => axios.delete(`${API_BASE}/albums/${albumsId}/photos/${photoId}`),

  updateUser: (userId, updates) => axios.put(`${API_BASE}/users/${userId}`, updates),//עדכון תגובה רק אם האימל נכון
  deleteUser: (userId, data) => axios.delete(`${API_BASE}/users/${userId}`, { data }),

  //logout
  logout: () => localStorage.removeItem('user')
}

export default api
