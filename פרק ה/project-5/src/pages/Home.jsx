import { Routes, Route, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Info from "./Info";
import Todos from "./Todos";
import Posts from "./Posts";
import Albums from "./Albums";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div>
      <h2>שלום, {user.name}</h2>
      <NavBar logout={logout} user={user}/>
      <Routes>
        <Route path="users/:id/info" element={<Info />} />
        <Route path="users/:id/todos" element={<Todos />} />
        <Route path="users/:id/posts" element={<Posts />} />
        <Route path="users/:id/albums" element={<Albums />} />
      </Routes>
    </div>
  );
}

export default Home;
