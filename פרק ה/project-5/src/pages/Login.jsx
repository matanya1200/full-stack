import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByUsername} from "../API/userService";
import "../CSS/login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // this maps to "website"
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3001/users?username=${username}`);
    const data = await res.json();

    if (data.length && data[0].website === password) {
      localStorage.setItem("user", JSON.stringify(data[0]));
      navigate(`/home/users/${data[0].id}/info`);
    } else {
      setError("שם משתמש או סיסמה שגויים.");
    }
  };

  return (
    <div className="login-wrapper">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
        <p className="redirect">
          Don’t have an account? <a onClick={()=>{navigate("/register")}}>Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
