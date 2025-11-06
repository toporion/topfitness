const router=require("express").Router();

const {addStaff, getAllStaff, getStaffById}=require("../controllers/StaffController");
const { fileUpload } = require("../middlewares/FileUploader");
const verifyRole = require("../middlewares/VerifyRole");
const verifyToken = require("../middlewares/VerifyToken");



router.post("/addStaff",verifyToken,verifyRole("admin"), fileUpload.single("profileImage"),addStaff);
router.get("/getAllStaff",verifyToken,verifyRole("admin"),getAllStaff)
router.get("/getStaffById/:id",verifyToken,verifyRole("admin"),getStaffById)

module.exports=router
