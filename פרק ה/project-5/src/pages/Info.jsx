import { use, useState, useEffect } from "react";
import {useParams, useNavigate} from "react-router-dom"
import "../CSS/Info.css";

function Info() {
  const { id } = useParams();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const neetMore = false;
  const navigate = useNavigate();

  
  useEffect(() => {
    navigate(`/home/users/${id}/info`);
  },[newName])

  const handleAddName = async (user) => {
    const res = await fetch(`http://localhost:3001/users/${id}`, {  
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    if (res.ok) {
      const updatedUser = { ...user, name: newName };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser)); 
      setNewName(""); 
    }
  };

  const handleAddEmail = async (user) => {
    const res = await fetch(`http://localhost:3001/users/${id}`, {
      method: "PATCH",  
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail }),
    });
    if (res.ok) {
      const updatedUser = { ...user, email: newEmail };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser)); 
      setNewEmail(""); 
    }
  };

  const handleAddPhone = async (user) =>{
    const res = await fetch(`http://localhost:3001/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: newPhone }),
    });

    if (res.ok) {
      const updatedUser = { ...user, phone: newPhone };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setNewPhone(""); 
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
          ...user.address,   
          street: newStreet, 
          city: newCity
        }};
      setUser(updatedUser); 
      localStorage.setItem("user", JSON.stringify(updatedUser)); 
      setNewStreet(""); 
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
          ...user.company,       
          name: newCompany     
        }};
      setUser(updatedUser); 
      localStorage.setItem("user", JSON.stringify(updatedUser)); 
      setNewCompany(""); 
    }
  }
  
  return (
<div className="info-wrapper">
  <h3 className="info-title">פרטי משתמש</h3>
    
    <p className="info-line">שם: <span className="info-value">{user.name || "אין"}</span></p>
    {user.name == null && (
      <div className="info-form">
        <input className="info-input" placeholder="שם" value={newName} onChange={(e) => setNewName(e.target.value)} />
        <button className="info-btn" onClick={() => handleAddName(user)}>הוסף</button>
      </div>
    )}
    <p className="info-line">שם משתמש: <span className="info-value">{user.username || "אין"}</span></p>
    <p className="info-line">אימייל: <span className="info-value">{user.email || "אין"}</span></p>
    {user.email == null && (
      <div className="info-form">
        <input className="info-input" placeholder="מייל" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
        <button className="info-btn" onClick={() => handleAddEmail(user)}>הוסף</button>
      </div>
    )}
    <p className="info-subtitle">כתובת:</p>
    <p className="info-line">רחוב: <span className="info-value">{user.address.street || "אין"}</span></p>
    <p className="info-line">עיר: <span className="info-value">{user.address.city || "אין"}</span></p>

    {(user.address.street == null || user.address.city == null) && (
      <div className="info-form">
        <input className="info-input" placeholder="רחוב" value={newStreet} onChange={(e) => setNewStreet(e.target.value)} />
        <input className="info-input" placeholder="עיר" value={newCity} onChange={(e) => setNewCity(e.target.value)} />
        <button className="info-btn" onClick={() => handleAddAddress(user)}>הוסף</button>
      </div>
    )}

    <p className="info-line">טלפון: <span className="info-value">{user.phone || "אין"}</span></p>
  {user.phone == null && (
    <div className="info-form">
      <input className="info-input" placeholder="טלפון" value={newPhone} onChange={(e) => setNewPhone(e.target.value)} />
      <button className="info-btn" onClick={() => handleAddPhone(user)}>הוסף</button>
    </div>
  )}

  <p className="info-line">חברה: <span className="info-value">{user.company.name || "אין"}</span></p>

  {user.company.name == null && (
    <div className="info-form">
      <input className="info-input" placeholder="חברה" value={newCompany} onChange={(e) => setNewCompany(e.target.value)} />
      <button className="info-btn" onClick={() => handleAddCompany(user)}>הוסף</button>
    </div>
  )}
</div>

  );
}

export default Info;