const { createEnoll, getMyEnrolledClasses } = require("../controllers/EnrllController");
const verifyRole = require("../middlewares/VerifyRole");
const verifyToken = require("../middlewares/VerifyToken");

const router = require("express").Router();


router.post('/enroll',verifyToken,verifyRole("client"),createEnoll);
router.get('/my-classes', verifyToken, verifyRole("client"), getMyEnrolledClasses)

module.exports=router