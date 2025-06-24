import React, { useEffect, useState } from "react";
import { getCourses, addCourse, deleteCourse, getTeachers } from "../api/api";

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  useEffect(() => {
    loadCourses();
    loadTeachers();
  }, []);

  const loadCourses = async () => {
    const res = await getCourses();
    setCourses(res.data.data);
  };

  const loadTeachers = async () => {
    const res = await getTeachers();
    setTeachers(res.data.data);
    if (res.data.data.length > 0) setSelectedTeacher(res.data.data[0].id);
  };

  const handleAdd = async () => {
    if (!newTitle || !selectedTeacher) return;
    await addCourse(newTitle, selectedTeacher);
    setNewTitle("");
    loadCourses();
  };

  const handleDelete = async (id) => {
    await deleteCourse(id);
    loadCourses();
  };

  return (
    <div>
      <h2>📚 Courses</h2>
      <ul>
        {courses.map((c) => (
          <li key={c.id}>
            {c.title} — 🧑‍🏫 {c.teacher_name}
            <button onClick={() => handleDelete(c.id)}>❌</button>
          </li>
        ))}
      </ul>
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="Course title"
      />
      <select
        value={selectedTeacher}
        onChange={(e) => setSelectedTeacher(e.target.value)}
      >
        {teachers.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>
      <button onClick={handleAdd}>Add Course</button>
    </div>
  );
}
