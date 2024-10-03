const Camp = require('../models/camp');
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

// Get all camps
exports.getCamps = async (req, res) => { 
    try { 
        const camps = await Camp.find(); 
        res.status(200).json(camps); 
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
}; 

// Get a specific camp by ID
exports.getCamp = async (req, res) => {
    try { 
        const { id } = req.params;
        const camp = await Camp.findById(id);
        if (!camp) return res.status(404).json({ message: 'camp name not found' }); 
        res.json(camp); 
    } catch (err) { 
        res.status(500).json({ message: err.message }); 
    }
};
    
// Create a new camp
exports.createCamp = async (req, res) => {
    const { camp_name, camp_detail, camp_place, camp_topic, date, time, people_count } = req.body;
    const image = req.file ? req.file.filename : null; // ใช้ชื่อไฟล์ภาพ

    const newCamp = new Camp({
        camp_name,
        camp_detail,
        camp_place,
        camp_topic,
        date,
        time,
        people_count,
        image
    });

    try {
        const savedCamp = await newCamp.save();
        res.status(201).json(savedCamp);
    } catch (error) {
        console.error('Error saving camp:', error);
        res.status(500).send('Failed to add camp');
    }
};


// Update a camp by ID
 // Update path if necessary

 exports.updateCamp = async (req, res) => {
    try {
        const { id } = req.params;
        let imagePath = req.body.image; // ใช้พาธภาพที่มีอยู่เดิมถ้าไม่อัปโหลดใหม่

        if (req.file) {
            imagePath = req.file.filename; // ใช้ชื่อไฟล์ใหม่ถ้ามีการอัปโหลดใหม่
        }

        const updatedCamp = await Camp.findByIdAndUpdate(id, {
            ...req.body,
            image: imagePath
        }, { new: true });

        if (!updatedCamp) return res.status(404).json({ message: 'Camp not found' });
        res.status(200).json(updatedCamp);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


// Delete a camp by ID
exports.deleteCamp = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCamp = await Camp.findByIdAndDelete(id);
        if (!deletedCamp) return res.status(404).json({ message: 'Camp not found' });
        res.status(200).json({ message: 'Camp deleted successfully' });
    } catch (err) { 
        res.status(400).json({ message: err.message }); 
    }
};
// Export the Multer upload middleware

//getHomepage
exports.getHomepage = async (req, res) => {
    try {
        const camps = await Camp.find(); // ดึงข้อมูลค่ายทั้งหมดจากฐานข้อมูล
        res.render("camp_homepage", { camps }); // ส่งข้อมูลค่ายไปยัง view
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.upload = upload.single('image'); // ใช้กับการอัปโหลดไฟล์เดี่ยว