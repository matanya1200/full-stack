import { Link } from "react-router-dom";

function NavBar({ logout }) {
  return (
    <nav style={{ marginBottom: "20px" }}>
      <Link to="/home/info">Info</Link> |{" "}
      <Link to="/home/todos">Todos</Link> |{" "}
      <Link to="/home/posts">Posts</Link> |{" "}
      <Link to="/home/albums">Albums</Link> |{" "}
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default NavBar;
