const express = require('express');
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const { upload } = require('../controller/courseController'); // import multer upload middleware
const Course = require('../models/course');
//Homepage
const { getHomepage } = require('../controller/courseController');
router.get('/', getHomepage);

//backend
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse } = require("../controller/courseController");
router.get("/courses", getCourses);
router.get("/course/:id", getCourse);



// API route to get courses by year
router.get('/course', async (req, res) => {
    try {
        const year = parseInt(req.query.year); // Get year from query parameter
        if (isNaN(year)) {
            return res.status(400).json({ message: 'Invalid year parameter' });
        }

        const startOfYear = new Date(year, 0, 1); // Start of the year
        const endOfYear = new Date(year + 1, 0, 1); // Start of the next year

        const course = await Course.find({
            date: {
                $gte: startOfYear,
                $lt: endOfYear
            }
        });

        res.json(course);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// เพิ่ม middleware upload สำหรับการอัปโหลดไฟล์ภาพใน post และ put routes
router.post("/course",  /*upload,*/ authenticateToken,createCourse);
router.put("/course/:id" , /*upload,*/ authenticateToken,updateCourse);

router.delete("/course/:id", authenticateToken, deleteCourse);

module.exports = router;