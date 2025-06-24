import React, { useEffect, useState } from "react";
import { getTeachers, addTeacher, deleteTeacher } from "../api/api";

export default function TeacherManager() {
  const [teachers, setTeachers] = useState([]);
  const [newTeacher, setNewTeacher] = useState("");

  useEffect(() => {
    getTeachers().then(res => setTeachers(res.data.data));
  }, []);

  const handleAdd = async () => {
    await addTeacher(newTeacher);
    setNewTeacher("");
    const res = await getTeachers();
    setTeachers(res.data.data);
  };

  const handleDelete = async (id) => {
    await deleteTeacher(id);
    const res = await getTeachers();
    setTeachers(res.data.data);
  };

  return (
    <div>
      <h2>👨‍🏫 Teachers</h2>
      <ul>
        {teachers.map(t => (
          <li key={t.id}>
            {t.name}
            <button onClick={() => handleDelete(t.id)}>❌</button>
          </li>
        ))}
      </ul>
      <input value={newTeacher} onChange={e => setNewTeacher(e.target.value)} placeholder="New teacher name" />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
