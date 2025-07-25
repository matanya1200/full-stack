import { use, useState, useEffect } from "react";
import {useParams, useNavigate} from "react-router-dom"
import { updateUser} from "../API/userService";

import "../CSS/Info.css";
import { toast } from 'react-toastify';

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
    await updateUser(id, { name: newName }).then(setUser);
    toast.success("השם נוסף בהצלחה!");
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setNewName("");
  };

  const handleAddEmail = async (user) => {
    await updateUser(id, { email: newEmail }).then(setUser);
    toast.success("המייל נוסף בהצלחה!");
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setNewEmail("");
  };

  const handleAddPhone = async (user) => {
    await updateUser(id, { phone: newPhone }).then(setUser);
    toast.success("הטלפון נוסף בהצלחה!");
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setNewPhone("");
  };
  
  const handleAddAddress = async (user) => {
    const updatedUser = await updateUser(id, {
      address: {
        ...user.address,
        street: newStreet,
        city: newCity,
      },
    });
    toast.success("הכתובת נוספה בהצלחה!");
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setNewStreet("");
    setNewCity("");
  };
  
  const handleAddCompany = async (user) => {
    const updatedUser = await updateUser(id, {
      company: {
        ...user.company,
        name: newCompany,
      },
    });
    toast.success("החברה נוספה בהצלחה!");
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setNewCompany("");
  };
  
  
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