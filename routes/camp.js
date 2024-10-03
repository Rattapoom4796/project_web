const express = require('express');
const router = express.Router();
const authenticateToken = require("../middlewares/auth");
const { upload } = require('../controller/campController');
const Camp = require('../models/camp'); // Import Camp model

// Homepage
const { getHomepage } = require('../controller/campController');
router.get('/', getHomepage);

// Backend
const { getCamps, getCamp, createCamp, updateCamp, deleteCamp } = require("../controller/campController");
router.get("/camps", getCamps);
router.get("/camp/:id", getCamp);

// API route to get camps by year
router.get('/camps', async (req, res) => {
    try {
        const year = parseInt(req.query.year); // Get year from query parameter
        if (isNaN(year)) {
            return res.status(400).json({ message: 'Invalid year parameter' });
        }

        const startOfYear = new Date(year, 0, 1); // Start of the year
        const endOfYear = new Date(year + 1, 0, 1); // Start of the next year

        const camps = await Camp.find({
            date: {
                $gte: startOfYear,
                $lt: endOfYear
            }
        });

        res.json(camps);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



// Add middleware upload for file uploads in post and put routes
router.post("/camp", upload, authenticateToken, createCamp);
router.put("/camp/:id", upload, authenticateToken, updateCamp);
router.delete("/camp/:id", authenticateToken, deleteCamp);

module.exports = router;