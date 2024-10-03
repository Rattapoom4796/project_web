const Course = require('../models/course');
const express = require('express');
const jwt = require("jsonwebtoken");
const bcrypt = require ("bcryptjs");
const multer = require('multer');
const path = require('path');

//upload img
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dirPath = path.join(__dirname, '../file_img'); // เปลี่ยนเป็นโฟลเดอร์ที่ต้องการเก็บไฟล์
        console.log("Saving to directory: ", dirPath); // ตรวจสอบว่าที่เก็บไฟล์ถูกต้อง
        cb(null, dirPath); // กำหนดโฟลเดอร์สำหรับเก็บไฟล์ภาพ
    },
    filename: function (req, file, cb) {
        const fileName = Date.now() + '-' + file.originalname;
        console.log("Uploading file as: ", fileName); // ตรวจสอบชื่อไฟล์
        cb(null, fileName); // ตั้งชื่อไฟล์ตามเวลาและชื่อไฟล์ต้นฉบับ
    }
});


// กำหนดการอัปโหลดโดยใช้ multer
const upload = multer({ storage: storage });

// Get all courses
exports.getCourses = async (req, res) => { 
    try { 
        const course = await Course.find(); 
        res.status(200).json(course); 
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
}; 

// Get a specific course by ID
exports.getCourse = async (req, res) => {
    try { 
        const { id } = req.params;
        const course = await Course.findById(id);
        if (!course) return res.status(404).json({ message: 'course name not found' }); 
        res.json(course); 
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
};
    
// Create a new course
exports.createCourse = async (req, res) => {
    const { course_name, course_detail, course_place, people_count, date, time } = req.body;
    const image = req.file ? req.file.filename : null; // Use file name if an image is uploaded


    const newCourse = new Course({
        course_name,
        course_detail,
        course_place,   
        people_count,
        date,
        time,
        image
    });

    try {
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (error) {
        console.error('Error saving course:', error);
        res.status(500).send('Failed to add course');
    }
};

// Update a course by ID
 // Update path if necessary

 exports.updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        let imagePath = req.body.image; // ใช้พาธภาพที่มีอยู่เดิมถ้าไม่อัปโหลดใหม่

        if (req.file) {
            imagePath = req.file.filename; // ใช้ชื่อไฟล์ใหม่ถ้ามีการอัปโหลดใหม่
        }

        const updatedCourse = await Course.findByIdAndUpdate(id, {
            ...req.body,
            image: imagePath
        }, { new: true });

        if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json(updatedCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Delete a course by ID
exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCourse = await Course.findByIdAndDelete(id);
        if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};
// Export the Multer upload middleware

//getHomepage
exports.getHomepage = async (req, res) => {
    try {
        const course = await Course.find(); // ดึงข้อมูลค่ายทั้งหมดจากฐานข้อมูล
        res.render("course_homepage", { course }); // ส่งข้อมูลค่ายไปยัง view
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.upload = upload.single('image'); // ใช้กับการอัปโหลดไฟล์เดี่ยว