import { Link } from "react-router-dom";
import "../CSS/navbar.css";

function NavBar({ logout, user }) {
  return (
    <nav className="navbar">
      <div className="navbar-center ">      
      <Link to={`/home/users/${user.id}/info`}>Info</Link> |{" "}
      <Link to={`/home/users/${user.id}/todos`}>Todos</Link> |{" "}
      <Link to={`/home/users/${user.id}/posts`}>Posts</Link> |{" "}
      <Link to={`/home/users/${user.id}/albums`}>Albums</Link> |{" "}
      </div>
      <button className="logout-btn" onClick={logout}>Logout</button>
    </nav>
  );
}

export default NavBar;
