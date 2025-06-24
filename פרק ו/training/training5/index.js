const mysql = require('mysql2/promise');

async function main() {
  let connection;
  
  try {
    // ✅ יצירת חיבור לבסיס הנתונים
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '2iW4sF7r',  // שנה בהתאם
      database: 'school_db'
    });

    console.log('🔗 התחברות לבסיס הנתונים הצליחה');

    // ✅ התחלת transaction
    await connection.beginTransaction();
    console.log('🔄 התחלת transaction...');

    // ✅ ניקוי הטבלאות (למניעת כפילויות)
    console.log('🧹 מנקה נתונים קיימים...');
    await connection.execute("DELETE FROM student_course");
    await connection.execute("DELETE FROM course");
    await connection.execute("DELETE FROM student");
    await connection.execute("DELETE FROM teacher");

    // ✅ הכנסת מורים (עם prepared statements)
    console.log('👨‍🏫 מוסיף מורים...');
    const teachers = ['shara', 'yoav', 'michal'];
    for (const name of teachers) {
      await connection.execute("INSERT INTO teacher (name) VALUES (?)", [name]);
    }

    // ✅ הכנסת תלמידים
    console.log('👨‍🎓 מוסיף תלמידים...');
    const studentNames = ['Dana', 'Uri', 'Noam', 'Aviatar', 'Gai', 'Tamar', 'Roni', 'Mika', 'Ity', 'Shira'];
    for (const name of studentNames) {
      await connection.execute("INSERT INTO student (name) VALUES (?)", [name]);
    }

    // ✅ הכנסת קורסים (עם prepared statements)
    console.log('📚 מוסיף קורסים...');
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

    // ✅ שיוך תלמידים לקורסים (רנדומלית)
    console.log('🔗 משייך תלמידים לקורסים...');
    for (let studentId = 1; studentId <= studentNames.length; studentId++) {
      // בחירת 2-3 קורסים רנדומלית לכל תלמיד
      const numCourses = Math.floor(Math.random() * 2) + 2; // 2-3 קורסים
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

    // ✅ אישור כל השינויים
    await connection.commit();
    console.log('✅ כל הנתונים נוספו בהצלחה!');
    console.log('==========================================');

    // ✅ שליפה ותצוגה של התוצאות
    console.log('📊 תצוגת נתוני בית הספר:');
    console.log('==========================================');

    const [coursesResult] = await connection.execute(`
      SELECT c.id AS course_id, c.title, t.name AS teacher_name
      FROM course c
      JOIN teacher t ON c.teacher_id = t.id
      ORDER BY c.title
    `);

    for (const course of coursesResult) {
      console.log(`📘 קורס: ${course.title} | מורה: ${course.teacher_name}`);

      const [studentsResult] = await connection.execute(`
        SELECT s.name 
        FROM student_course sc
        JOIN student s ON sc.student_id = s.id
        WHERE sc.course_id = ?
        ORDER BY s.name
      `, [course.course_id]);

      if (studentsResult.length > 0) {
        studentsResult.forEach(s => console.log(`   👨‍🎓 תלמיד: ${s.name}`));
      } else {
        console.log('   📝 אין תלמידים רשומים לקורס זה');
      }
      console.log(''); // שורה ריקה להפרדה
    }

    // ✅ סטטיסטיקות כלליות
    console.log('==========================================');
    console.log('📈 סטטיסטיקות:');
    
    const [teacherCount] = await connection.execute('SELECT COUNT(*) as count FROM teacher');
    const [studentCount] = await connection.execute('SELECT COUNT(*) as count FROM student');
    const [courseCount] = await connection.execute('SELECT COUNT(*) as count FROM course');
    const [enrollmentCount] = await connection.execute('SELECT COUNT(*) as count FROM student_course');
    
    console.log(`👨‍🏫 מספר מורים: ${teacherCount[0].count}`);
    console.log(`👨‍🎓 מספר תלמידים: ${studentCount[0].count}`);
    console.log(`📚 מספר קורסים: ${courseCount[0].count}`);
    console.log(`🔗 מספר רישומים לקורסים: ${enrollmentCount[0].count}`);

  } catch (error) {
    // ✅ במקרה של שגיאה - ביטול כל השינויים
    if (connection) {
      await connection.rollback();
      console.log('🔄 Transaction בוטל בגלל שגיאה');
    }
    console.error('❌ שגיאה בהפעלת הסקריפט:');
    console.error('   הודעת שגיאה:', error.message);
    console.error('   סוג השגיאה:', error.code || 'לא ידוע');
    
    // הצעות לפתרון שגיאות נפוצות
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 הצעה: בדוק שהשרת MySQL פועל');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('💡 הצעה: בדוק את פרטי החיבור (משתמש/סיסמה)');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('💡 הצעה: בדוק שבסיס הנתונים school_db קיים');
    }
    
  } finally {
    // ✅ סגירת החיבור (תמיד)
    if (connection) {
      await connection.end();
      console.log('🔌 חיבור לבסיס הנתונים נסגר');
    }
  }
}

// ✅ הפעלת הפונקציה הראשית
main().catch(error => {
  console.error('❌ שגיאה קריטית:', error.message);
  process.exit(1);
});