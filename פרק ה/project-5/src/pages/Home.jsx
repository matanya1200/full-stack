import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Info from "./Info";
import Todos from "./Todos";
import PostsList from "./PostsList";
import PostDetails from "./PostDetails";
import AlbumsList from "./AlbumsList";
import AlbumDetails from "./AlbumDetails";
import { useState, useEffect } from "react";
import "../CSS/Home.css";
function Home() {

  const navigate = useNavigate();

  const [userName, setName] = useState(JSON.parse(localStorage.getItem("user")).username);
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    setName(JSON.parse(localStorage.getItem("user")).username);
  },[userName])

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
<div className="home-wrapper">
  <h2 className="home-title">Hello, {userName}</h2>

  <NavBar logout={logout} user={user} />

  <div className="home-content">
    <Routes>
      <Route path="users/:id/info" element={<Info />} />
      <Route path="users/:id/todos" element={<Todos />} />
      <Route path="users/:id/posts" element={<PostsList />} />
      <Route path="users/:id/posts/:postId" element={<PostDetails />} />
      <Route path="users/:id/albums" element={<AlbumsList />} />
      <Route path="users/:id/albums/:albumId/photos" element={<AlbumDetails />} />
    </Routes>
  </div>
</div>

  );
}

export default Home;
