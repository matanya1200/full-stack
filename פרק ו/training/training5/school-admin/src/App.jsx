import React from "react";
import TeacherManager from "./components/TeacherManager";
import StudentManager from "./components/StudentManager";
import CourseManager from "./components/CourseManager";
import EnrollmentManager from "./components/EnrollmentManager";

function App() {
  return (
    <div className="App">
      <h1>🏫 School Admin Dashboard</h1>
      <TeacherManager />
      <hr />
      <StudentManager />
      <hr />
      <CourseManager />
      <hr />
      <EnrollmentManager />
    </div>
  );
}

export default App;
