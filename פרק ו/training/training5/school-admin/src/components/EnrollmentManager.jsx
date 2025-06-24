import React, { useEffect, useState } from "react";
import {
  getCourses,
  getStudents,
  enrollStudent,
  getCourseStudents,
  unenrollStudents,
} from "../api/api";

export default function EnrollmentManager() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [courseStudents, setCourseStudents] = useState([]);

  useEffect(() => {
    loadCourses();
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedCourse) loadCourseStudents(selectedCourse);
  }, [selectedCourse]);

  const loadCourses = async () => {
    const res = await getCourses();
    setCourses(res.data.data);
    if (res.data.data.length > 0) {
      setSelectedCourse(res.data.data[0].id);
    }
  };

  const loadStudents = async () => {
    const res = await getStudents();
    setStudents(res.data.data);
    if (res.data.data.length > 0) {
      setSelectedStudent(res.data.data[0].id);
    }
  };

  const loadCourseStudents = async (courseId) => {
    const res = await getCourseStudents(courseId);
    setCourseStudents(res.data.students);
  };

  const handleEnroll = async () => {
    if (!selectedCourse || !selectedStudent) return;
    await enrollStudent(selectedStudent, selectedCourse);
    loadCourseStudents(selectedCourse);
  };

  const handleUnenroll = async (studentId) => {
    await unenrollStudents(studentId, selectedCourse);
    loadCourseStudents(selectedCourse);
  };

  return (
    <div>
      <h2>🔗 רישום תלמידים לקורסים</h2>
      <div>
        <label>בחר קורס:</label>{" "}
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>בחר תלמיד:</label>{" "}
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
        <button onClick={handleEnroll}>➕ רישום</button>
      </div>

      <h4>📋 רשימת תלמידים בקורס</h4>
      <ul>
        {courseStudents.map((s) => (
            <li key={s.id}>
                {s.name}{" "}
                <button onClick={() => handleUnenroll(s.id)}>❌ delete</button>
            </li>
        ))}
      </ul>
    </div>
  );
}
