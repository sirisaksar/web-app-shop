const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../config/db"); // ดึง db มาจากโฟลเดอร์ config

// Endpoint สำหรับสมัครสมาชิก: POST /api/users/register
router.post("/register", async (req, res) => {
    // 1. รับข้อมูลจากหน้าเว็บให้ตรงกับตารางฐานข้อมูล
    const { email, password, username, first_name, last_name, phone, address, role } = req.body;

    try {
        // 2. เช็กว่าอีเมลนี้มีอยู่ในระบบหรือยัง
        const [existingUsers] = await db.query("SELECT email FROM users WHERE email = ?", [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: "อีเมลนี้ถูกใช้งานไปแล้ว" });
        }

        // 3. เข้ารหัสรหัสผ่าน (เพื่อความปลอดภัย)
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. บันทึกข้อมูลลงตาราง users
        const sql = `INSERT INTO users (email, password, username, first_name, last_name, phone, address, role) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        await db.query(sql, [email, hashedPassword, username, first_name, last_name, phone, address, role]);

        // 5. ส่งข้อความแจ้งเตือนเมื่อสำเร็จ
        res.status(201).json({ message: "สมัครสมาชิกและบันทึกข้อมูลสำเร็จ!" });

    } catch (error) {
        console.error("Register Error:", error);
        
        // กรณีมี Error จากฐานข้อมูล (เช่น มีอีเมลหลุดมาซ้ำ)
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "อีเมลนี้ถูกใช้งานไปแล้ว" });
        }

        res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(400).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }

        res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ!", user: { id: user.id, email: user.email, username: user.username, role: user.role } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
});

module.exports = router;