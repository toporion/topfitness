const { registerUser, loginUser } = require("../controllers/UserController");
const { fileUpload } = require("../middlewares/FileUploader");

const router = require("express").Router();

router.post('/register',fileUpload.single('profileImage'),registerUser);
router.post('/login',loginUser);

module.exports = router;