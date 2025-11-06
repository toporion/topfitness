const { createClient } = require("../controllers/ClientController");
const { fileUpload } = require("../middlewares/FileUploader");
const verifyToken = require("../middlewares/VerifyToken");

const router = require("express").Router();

router.post("/addClient",fileUpload.single("profileImage"),createClient);

module.exports=router