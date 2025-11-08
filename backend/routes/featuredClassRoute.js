const { createClss, getAllClasses, getSingleClass, getClassByTrainerId } = require("../controllers/FeaturedClassController");
const { fileUpload } = require("../middlewares/FileUploader");
const verifyToken = require("../middlewares/VerifyToken");

const router = require("express").Router();

router.post('/create-class',verifyToken,fileUpload.single('coverImage'),createClss);
router.get('/get-classes',getAllClasses);
router.get('/get-class/:id',getSingleClass)
router.get('/trainer/classes',verifyToken,getClassByTrainerId)

module.exports=router