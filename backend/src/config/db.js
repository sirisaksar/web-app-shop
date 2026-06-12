const mysql = require("mysql2/promise");

// สร้าง Connection Pool (แนะนำสำหรับการทำเว็บ เพราะจัดการการเชื่อมต่อได้ดีกว่า)
const db = mysql.createPool({
    host: "localhost",
    user: "root",           // เปลี่ยนเป็น user ฐานข้อมูลของคุณ (เช่น root)
    password: "",           // เปลี่ยนเป็นรหัสผ่านฐานข้อมูลของคุณ
    database: "store_db"     // ⚠️ เปลี่ยนเป็นชื่อฐานข้อมูลของคุณให้ถูกต้อง
});

// ทดสอบการเชื่อมต่อ
db.getConnection()
    .then(connection => {
        console.log("MySQL เชื่อมต่อสำเร็จผ่าน Pool!");
        connection.release();
    })
    .catch(err => {
        console.error("เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล:", err);
    });

module.exports = db;