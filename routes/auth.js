const express = require('express');
const router = express.Router();

const {register,login,refresh,validateToken} = require("../controller/adminController");
router.post("/",async(req,res) => {
    res.sendStatus(404);
});
router.post("/register",register);
router.post("/login",login);
router.post("/refresh",refresh);
router.get('/validate', validateToken);  // นำเข้าฟังก์ชัน validateToken

module.exports = router;