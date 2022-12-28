const express = require("express");
const router = express.Router();
const path = require('path');
const userController = require("../controllers/user-controller");
const middleware = require("../middleware/jwtVerify");
const utility = require("../helper/utility");
const upload = require('../middleware/multer')

router.post("/sign-up",userController.sign_up);
router.post("/otpVerify",userController.otpVerify);
router.post("/updateProfile",userController.updateProfile);
router.post("/login",userController.login);
router.post("/imgUpload",upload.profile.any(),userController.imgUpload);
router.post("/forgetPassword",userController.forgetPassword);
module.exports = router;