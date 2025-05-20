import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      navigate("/home");
    } else {
      setError("שם משתמש או סיסמה שגויים.");
    }
  };

  return (
    <div>
      <h2>התחברות</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>אין לך משתמש? <a href="/register">להרשמה</a></p>
    </div>
  );
}

export default Login;
