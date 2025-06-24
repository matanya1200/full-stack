const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = 3000;

// ✅ Middleware
app.use(express.json());
app.use(cors());

// ✅ הגדרת חיבור לבסיס נתונים
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '2iW4sF7r',  // שנה בהתאם
  database: 'school_db'
};

// ✅ פונקציה ליצירת חיבור
async function getConnection() {
  return await mysql.createConnection(dbConfig);
}

// ✅ דף בית - רשימת כל ה-endpoints
app.get('/', (req, res) => {
  res.json({
    message: '🏫 Welcome to a school manegment system',
    endpoints: {
      teachers: {
        'GET /api/teachers': 'Teachers kist',
        'POST /api/teachers': 'Add new teachet',
        'PUT /api/teachers/:id': 'Update teacher',
        'DELETE /api/teachers/:id': 'Deleve teacher'
      },
      students: {
        'GET /api/students': 'Student list',
        'POST /api/students': 'Add new student',
        'PUT /api/students/:id': 'Update student',
        'DELETE /api/students/:id': 'Delete studernt'
      },
      courses: {
        'GET /api/courses': 'Courses list',
        'GET /api/courses/:id/students': 'Student in a course',
        'POST /api/courses': 'Add new course',
        'PUT /api/courses/:id': 'Update course',
        'DELETE /api/courses/:id': 'Delete course'
      },
      enrollments: {
        'POST /api/enroll': 'Enrollments into a course',
        'DELETE /api/enroll': 'unenroll'
      },
      setup: {
        'POST /api/setup': 'Create a false data for the system'
      }
    }
  });
});

// ===============================
// 👨‍🏫 TEACHERS API
// ===============================

// קבלת כל המורים
app.get('/api/teachers', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [teachers] = await connection.execute('SELECT * FROM teacher ORDER BY name');
    res.json({ success: true, data: teachers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// הוספת מורה חדש
app.post('/api/teachers', async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, error: 'teacher name needed' });
  }

  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute('INSERT INTO teacher (name) VALUES (?)', [name]);
    res.json({ success: true, message: 'teacher added successfully', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// עדכון מורה
app.put('/api/teachers/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, error: 'teacher name needed' });
  }

  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute('UPDATE teacher SET name = ? WHERE id = ?', [name, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'teacher not found' });
    }
    
    res.json({ success: true, message: 'teacher updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// מחיקת מורה
app.delete('/api/teachers/:id', async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM teacher WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'teacher not found' });
    }
    
    res.json({ success: true, message: 'teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// ===============================
// 👨‍🎓 STUDENTS API
// ===============================

// קבלת כל התלמידים
app.get('/api/students', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [students] = await connection.execute('SELECT * FROM student ORDER BY name');
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// הוספת תלמיד חדש
app.post('/api/students', async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, error: 'שם התלמיד נדרש' });
  }

  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute('INSERT INTO student (name) VALUES (?)', [name]);
    res.json({ success: true, message: 'תלמיד נוסף בהצלחה', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// עדכון תלמיד
app.put('/api/students/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ success: false, error: 'שם התלמיד נדרש' });
  }

  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute('UPDATE student SET name = ? WHERE id = ?', [name, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'תלמיד לא נמצא' });
    }
    
    res.json({ success: true, message: 'תלמיד עודכן בהצלחה' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// מחיקת תלמיד
app.delete('/api/students/:id', async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM student WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'תלמיד לא נמצא' });
    }
    
    res.json({ success: true, message: 'תלמיד נמחק בהצלחה' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// ===============================
// 📚 COURSES API
// ===============================

// קבלת כל הקורסים עם פרטי המורה
app.get('/api/courses', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    const [courses] = await connection.execute(`
      SELECT c.id, c.title, c.teacher_id, t.name AS teacher_name
      FROM course c
      JOIN teacher t ON c.teacher_id = t.id
      ORDER BY c.title
    `);
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// קבלת תלמידים בקורס מסוים
app.get('/api/courses/:id/students', async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await getConnection();
    
    // בדיקה שהקורס קיים
    const [course] = await connection.execute(`
      SELECT c.title, t.name AS teacher_name
      FROM course c
      JOIN teacher t ON c.teacher_id = t.id
      WHERE c.id = ?
    `, [id]);

    if (course.length === 0) {
      return res.status(404).json({ success: false, error: 'קורס לא נמצא' });
    }

    // קבלת התלמידים
    const [students] = await connection.execute(`
      SELECT s.id, s.name
      FROM student_course sc
      JOIN student s ON sc.student_id = s.id
      WHERE sc.course_id = ?
      ORDER BY s.name
    `, [id]);

    res.json({ 
      success: true, 
      course: course[0],
      students: students
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// הוספת קורס חדש
app.post('/api/courses', async (req, res) => {
  const { title, teacher_id } = req.body;
  
  if (!title || !teacher_id) {
    return res.status(400).json({ success: false, error: 'שם הקורס ומזהה המורה נדרשים' });
  }

  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute('INSERT INTO course (title, teacher_id) VALUES (?, ?)', [title, teacher_id]);
    res.json({ success: true, message: 'קורס נוסף בהצלחה', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// עדכון קורס
app.put('/api/courses/:id', async (req, res) => {
  const { id } = req.params;
  const { title, teacher_id } = req.body;

  if (!title || !teacher_id) {
    return res.status(400).json({ success: false, error: 'שם הקורס ומזהה המורה נדרשים' });
  }

  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute('UPDATE course SET title = ?, teacher_id = ? WHERE id = ?', [title, teacher_id, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'קורס לא נמצא' });
    }
    
    res.json({ success: true, message: 'קורס עודכן בהצלחה' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// מחיקת קורס
app.delete('/api/courses/:id', async (req, res) => {
  const { id } = req.params;

  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute('DELETE FROM course WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'קורס לא נמצא' });
    }
    
    res.json({ success: true, message: 'קורס נמחק בהצלחה' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// ===============================
// 🔗 ENROLLMENT API
// ===============================

// רישום תלמיד לקורס
app.post('/api/enroll', async (req, res) => {
  const { student_id, course_id } = req.body;

  if (!student_id || !course_id) {
    return res.status(400).json({ success: false, error: 'מזהה תלמיד ומזהה קורס נדרשים' });
  }

  let connection;
  try {
    connection = await getConnection();
    
    // בדיקה אם הרישום כבר קיים
    const [existing] = await connection.execute(
      'SELECT * FROM student_course WHERE student_id = ? AND course_id = ?',
      [student_id, course_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, error: 'תלמיד כבר רשום לקורס זה' });
    }

    await connection.execute(
      'INSERT INTO student_course (student_id, course_id) VALUES (?, ?)',
      [student_id, course_id]
    );
    
    res.json({ success: true, message: 'תלמיד נרשם לקורס בהצלחה' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// ביטול רישום תלמיד לקורס
app.delete('/api/enroll', async (req, res) => {
  const { student_id, course_id } = req.body;

  if (!student_id || !course_id) {
    return res.status(400).json({ success: false, error: 'מזהה תלמיד ומזהה קורס נדרשים' });
  }

  let connection;
  try {
    connection = await getConnection();
    const [result] = await connection.execute(
      'DELETE FROM student_course WHERE student_id = ? AND course_id = ?',
      [student_id, course_id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'רישום לא נמצא' });
    }
    
    res.json({ success: true, message: 'רישום בוטל בהצלחה' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// ===============================
// 🚀 SETUP API - יצירת נתוני דמה
// ===============================

app.post('/api/setup', async (req, res) => {
  let connection;
  try {
    connection = await getConnection();
    await connection.beginTransaction();

    // ניקוי נתונים קיימים
    await connection.execute("DELETE FROM student_course");
    await connection.execute("DELETE FROM course");
    await connection.execute("DELETE FROM student");  
    await connection.execute("DELETE FROM teacher");

    // הוספת מורים
    const teachers = ['shara', 'yoav', 'michal'];
    for (const name of teachers) {
      await connection.execute("INSERT INTO teacher (name) VALUES (?)", [name]);
    }

    // הוספת תלמידים
    const studentNames = ['Dana', 'Uri', 'Noam', 'Aviatar', 'Gai', 'Tamar', 'Roni', 'Mika', 'Ity', 'Shira'];
    for (const name of studentNames) {
      await connection.execute("INSERT INTO student (name) VALUES (?)", [name]);
    }

    // הוספת קורסים
    const courses = [
      { title: 'Math', teacher_id: 1 },
      { title: 'English', teacher_id: 2 },
      { title: 'History', teacher_id: 3 },
      { title: 'Chemistry', teacher_id: 1 },
      { title: 'Physics', teacher_id: 2 }
    ];
    
    for (const course of courses) {
      await connection.execute(
        "INSERT INTO course (title, teacher_id) VALUES (?, ?)", 
        [course.title, course.teacher_id]
      );
    }

    // שיוך תלמידים לקורסים
    for (let studentId = 1; studentId <= students.length; studentId++) {
      const numCourses = Math.floor(Math.random() * 2) + 2;
      const availableCourses = [1, 2, 3, 4, 5];
      const selectedCourses = availableCourses
        .sort(() => 0.5 - Math.random())
        .slice(0, numCourses);
      
      for (const courseId of selectedCourses) {
        await connection.execute(
          "INSERT INTO student_course (student_id, course_id) VALUES (?, ?)", 
          [studentId, courseId]
        );
      }
    }

    await connection.commit();
    res.json({ success: true, message: 'נתוני דמה נוצרו בהצלחה!' });
    
  } catch (error) {
    if (connection) await connection.rollback();
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (connection) await connection.end();
  }
});

// ===============================
// 🎯 הפעלת השרת
// ===============================

app.listen(PORT, () => {
  console.log(`🏫 שרת בית הספר פועל על http://localhost:${PORT}`);
  console.log(`📋 רשימת endpoints זמינה ב-http://localhost:${PORT}`);
});

// טיפול בשגיאות לא צפויות
process.on('uncaughtException', (error) => {
  console.error('❌ שגיאה לא צפויה:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise לא מטופל:', reason);
  process.exit(1);
});