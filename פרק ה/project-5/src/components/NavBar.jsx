import { Link } from "react-router-dom";

function NavBar({ logout, user }) {
  return (
    <nav style={{ marginBottom: "20px" }}>
      <Link to={`/home/users/${user.id}/info`}>Info</Link> |{" "}
      <Link to={`/home/users/${user.id}/todos`}>Todos</Link> |{" "}
      <Link to={`/home/users/${user.id}/posts`}>Posts</Link> |{" "}
      <Link to={`/home/users/${user.id}/albums`}>Albums</Link> |{" "}
      <button onClick={logout}>Logout</button>
    </nav>
  );
}

export default NavBar;
