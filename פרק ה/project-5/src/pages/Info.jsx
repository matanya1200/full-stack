import { use, useState } from "react";
import {useParams} from "react-router-dom"
function Info() {
  const { id } = useParams();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser);
  const [newPhone, setNewPhone] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const neetMore = false;

  const handleAddPhone = async (user) =>{
    const res = await fetch(`http://localhost:3001/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: newPhone }),
    });

    if (res.ok) {
      const updatedUser = { ...user, phone: newPhone };
      setUser(updatedUser); // עדכון ה־state
      localStorage.setItem("user", JSON.stringify(updatedUser)); // עדכון ב־LS
      setNewPhone(""); // ניקוי השדה
    }
  }
  const handleAddAddress = async (user) =>{
    const res = await fetch(`http://localhost:3001/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: {
        ...user.address,
        street: newStreet,
        city: newCity
      }, }),
    });

    if (res.ok) {
      const updatedUser = {
        ...user,
        address: {
          ...user.address,       // שומר את שאר שדות הכתובת
          street: newStreet,   // מעדכן רק את הרחוב
          city: newCity
        }};
      setUser(updatedUser); // עדכון ה־state
      localStorage.setItem("user", JSON.stringify(updatedUser)); // עדכון ב־LS
      setNewStreet(""); // ניקוי השדה
      setNewCity("")
    }
  }
  const handleAddCompany = async (user) =>{
    const res = await fetch(`http://localhost:3001/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company: {
        ...user.company,
        name: newCompany,
      },}),
    });

    if (res.ok) {
      const updatedUser = {
        ...user,
        company: {
          ...user.company,       // שומר את שאר שדות הכתובת
          name: newCompany     // מעדכן רק את הרחוב
        }};
      setUser(updatedUser); // עדכון ה־state
      localStorage.setItem("user", JSON.stringify(updatedUser)); // עדכון ב־LS
      setNewCompany(""); // ניקוי השדה
    }
  }
  
  return (
    <div>
      <h3>פרטי משתמש</h3>
      <p>שם: {user.name}</p>
      <p>שם משתמש: {user.username || null}</p>
      <p>אימייל: {user.email || null}</p>

      <p>כתובת:</p>
      <p>רחוב: {user.address.street || "אין"}</p>
      <p>עיר:{user.address.city || "אין"}</p>
      {(user.address.street == null || user.address.city == null) &&
      (<div>
        <input placeholder="רחוב" value={newStreet} onChange={(e) => setNewStreet(e.target.value)} />
        <input placeholder="עיר" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
        <button onClick={() => handleAddAddress(user)}>הוסף</button>
      </div>)}

      <p>טלפון: {user.phone || "אין"}</p>
      
      {user.phone == null &&
      (<div>
        <input placeholder="טלפון" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
        <button onClick={() => handleAddPhone(user)}>הוסף</button>
      </div>)}

      <p>חברה: {user.company.name || "אין"}</p>
      
      {user.company.name == null &&
      (<div>
        <input placeholder="חברה" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} />
        <button onClick={() => handleAddCompany(user)}>הוסף</button>
      </div>)}
    </div>
  );
}

export default Info;