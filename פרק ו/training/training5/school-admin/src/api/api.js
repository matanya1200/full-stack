import axios from 'axios';

const BASE_URL = "http://localhost:3000/api";

export const getTeachers = () => axios.get(`${BASE_URL}/teachers`);
export const addTeacher = (name) => axios.post(`${BASE_URL}/teachers`, { name });
export const deleteTeacher = (id) => axios.delete(`${BASE_URL}/teachers/${id}`);

export const getStudents = () => axios.get(`${BASE_URL}/students`);
export const addStudent = (name) => axios.post(`${BASE_URL}/students`, { name });
export const deleteStudent = (id) => axios.delete(`${BASE_URL}/students/${id}`);

export const getCourses = () => axios.get(`${BASE_URL}/courses`);
export const addCourse = (title, teacher_id) => axios.post(`${BASE_URL}/courses`, { title, teacher_id });
export const deleteCourse = (id) => axios.delete(`${BASE_URL}/courses/${id}`);

export const enrollStudent = (student_id, course_id) =>
  axios.post(`${BASE_URL}/enroll`, { student_id, course_id });
export const getCourseStudents = (courseId) =>
  axios.get(`${BASE_URL}/courses/${courseId}/students`);
export const unenrollStudents = (student_id, course_id) =>
  axios.delete(`${BASE_URL}/enroll`, {
    data: { student_id, course_id },
  });
