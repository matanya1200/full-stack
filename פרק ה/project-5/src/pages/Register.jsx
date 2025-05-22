import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserByUsername, createUser} from "../API/userService";
import "../CSS/Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if(username == "") {
      setError("הכנס שם משתמש")
      return
    }

    if (password !== verifyPassword) {
      setError("הסיסמאות לא תואמות");
      return;
    }

    const existing = await getUserByUsername(username);
    if (existing.length > 0) {
      setError("שם המשתמש כבר קיים");
      return;
    }

    const newUser = {
      name: null,
      username,
      email: null,
      website: password,
      address:{street:null},
      phone:null,
      company:{name:null}
    };

    const savedUser = await createUser(newUser);
    localStorage.setItem("user", JSON.stringify(savedUser));
    navigate(`/home/users/${savedUser.id}/info`);
  };

  const returnfanc = () => {
    navigate("/login");
  }

  return (
    <div className="register-wrapper">
      <form className="register-form" onSubmit={handleRegister}>

        <h2>Register</h2>

        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input placeholder="Verify Password" type="password" value={verifyPassword} onChange={(e) => setVerifyPassword(e.target.value)} />

        {error && <p className="error">{error}</p>}

        <button type="submit">Create Account</button>

        <p className="redirect">
          Already have an account? <a onClick={returnfanc}>Login</a>
        </p>

      </form>
    </div>
  );
}

export default Register;
