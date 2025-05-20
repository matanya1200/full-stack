import { useState } from "react";
function Info() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser);
  const [newPhone, setNewPhone] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newCompany, setNewCompany] = useState("");

  const handleAddPhone = async (user) =>{
    const res = await fetch(`http://localhost:3001/users/${user.id}`, {
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
    const res = await fetch(`http://localhost:3001/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: {
        ...user.address,
        street: newAddress,
      }, }),
    });

    if (res.ok) {
      const updatedUser = {
        ...user,
        address: {
          ...user.address,       // שומר את שאר שדות הכתובת
          street: newAddress     // מעדכן רק את הרחוב
        }};
      setUser(updatedUser); // עדכון ה־state
      localStorage.setItem("user", JSON.stringify(updatedUser)); // עדכון ב־LS
      setNewAddress(""); // ניקוי השדה
    }
  }
  const handleAddCompany = async (user) =>{
    const res = await fetch(`http://localhost:3001/users/${user.id}`, {
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

      <p>רחוב מגורים : {user.address.street || "אין"}</p>

      <input placeholder="טלפון" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
      <button onClick={() => handleAddAddress(user)}>הוסף</button>

      <p>טלפון: {user.phone || "אין"}</p>

      <input placeholder="טלפון" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
      <button onClick={() => handleAddPhone(user)}>הוסף</button>

      <p>חברה: {user.company.name || "אין"}</p>

      <input placeholder="טלפון" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} />
      <button onClick={() => handleAddCompany(user)}>הוסף</button>
    </div>
  );
}

export default Info;