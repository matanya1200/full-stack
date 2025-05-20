import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if(username == "") {
      setError("הכנס שם משתמש")
    }

    if(!error && email == "") {
      setError("הכנס אימייל")
    }

    if (!error && password !== verifyPassword) {
      setError("הסיסמאות לא תואמות");
      return;
    }

    const res = await fetch(`http://localhost:3001/users?username=${username}`);
    const existing = await res.json();
    if (existing.length > 0) {
      setError("שם המשתמש כבר קיים");
      return;
    }

    const newUser = {
      name: name || "משתמש חדש",
      username,
      email: email,
      website: password, // כמו סיסמה
      address:{street:null},
      phone:null,
      company:{name:null}
    };

    const postRes = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    const savedUser = await postRes.json();
    localStorage.setItem("user", JSON.stringify(savedUser));
    navigate("/home");
  };

  return (
    <div>
      <h2>הרשמה</h2>
      <form onSubmit={handleRegister}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input placeholder="Verify Password" type="password" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p> חזרה לעמוד כניסה<a href="/login"> לכניסה</a></p>
    </div>
  );
}

export default Register;
