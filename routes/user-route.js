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
router.post("/latLong",userController.latLong);
router.post("/imgUpload",upload.profile.any(),userController.imgUpload);
router.post("/deleteImg",userController.deleteImg);
router.post("/resetPassword",userController.resetPassword);
router.post("/resendOtp",userController.resendOtp);
router.post("/forgetPassword",userController.forgetPassword);
module.exports = router;