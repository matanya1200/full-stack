import React, { useEffect, useState } from "react";
import { getStudents, addStudent, deleteStudent } from "../api/api";

export default function StudentManager() {
  const [students, setStudents] = useState([]);
  const [newStudent, setNewStudent] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    const res = await getStudents();
    setStudents(res.data.data);
  };

  const handleAdd = async () => {
    if (!newStudent.trim()) return;
    await addStudent(newStudent);
    setNewStudent("");
    loadStudents();
  };

  const handleDelete = async (id) => {
    await deleteStudent(id);
    loadStudents();
  };

  return (
    <div>
      <h2>👨‍🎓 Students</h2>
      <ul>
        {students.map((s) => (
          <li key={s.id}>
            {s.name}
            <button onClick={() => handleDelete(s.id)}>❌</button>
          </li>
        ))}
      </ul>
      <input
        value={newStudent}
        onChange={(e) => setNewStudent(e.target.value)}
        placeholder="New student name"
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
