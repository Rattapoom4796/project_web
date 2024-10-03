const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ตั้งค่าให้ Express ใช้โฟลเดอร์ file_img สำหรับไฟล์ static
app.use('/file_img', express.static(path.join(__dirname, 'file_img')));

// ตรวจสอบการเข้าสู่ระบบโดยใช้ JWT
function checkAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.redirect('/camp_login'); // เปลี่ยนเส้นทางไปที่หน้า login ถ้าไม่มี token
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.redirect('/camp_login'); // เปลี่ยนเส้นทางไปที่หน้า login ถ้า token ไม่ถูกต้อง
        req.user = user; // เก็บข้อมูลของผู้ใช้ใน request
        next();
    });
}

// Serve HTML file

// camp_page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'camp_page', 'camp_homepage.html'));
});

app.use(express.static(path.join(__dirname, 'camp_page'))); // ตั้งค่าเส้นทางของไฟล์ HTML

app.get('/camp_login', (req, res) => {
    res.sendFile(path.join(__dirname, 'camp_page', 'camp_login.html')); // เส้นทางของไฟล์ HTML
});

// ใช้ middleware ตรวจสอบการเข้าสู่ระบบก่อนให้เข้าถึงหน้า camp_adminpage
app.get('/camp_adminpage', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'camp_page', 'camp_adminpage.html'));
});

// course_page
app.get('/course', (req, res) => {
    res.sendFile(path.join(__dirname, 'course_page', 'course_homepage.html'));
});

app.use(express.static(path.join(__dirname, 'course_page')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_URI, {})
    .then(() => {
        console.log("Mongo Connected");
    })
    .catch((err) => console.error(err.message));

// config routes
const campRoute = require("./routes/camp");
app.use("/api", campRoute);

const authRoute = require("./routes/auth");
app.use("/api/auth", authRoute);

const courseRoute = require("./routes/course");
app.use("/api", courseRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));