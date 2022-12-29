/* eslint-disable no-unused-vars */
const model = require("../models/db");
const user = model.users;
const device = model.devices;
const location = model.locations;
const nodemailer = require('nodemailer');
const challenge = model.challenges;
const userChallenge = model.userChallenges;
const db = require("../models/db");
const { Op } = require("sequelize");
const response = require("../helper/response");
const utility = require("../helper/utility");
const { param, body, validationResult } = require("express-validator");
const { userLogger } = require("../logger/logger");
const constants = require("../helper/constants");
const { log } = require("winston");

// user sign up
exports.sign_up = [
    body("firstName").trim().notEmpty().withMessage("firstname is required"),
    body("lastName").trim().notEmpty().withMessage("lastname is required"),
    body("email").trim().notEmpty().withMessage("email is required"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return response.errorResponseWithData(res, errors.array()[0]["msg"], errors.array());
            }
            // check if email and number is already in use and profile completed
            const find_user = await db.User.findOne({
                where: {
                    email: req.body.email.toLowerCase()
                }
            });
            console.log(find_user, "dfyhjsuy");
            // if found
            if (find_user) {
                // if profile created is true

                userLogger.error("Email and mobile number already exists");
                response.errorResponse(res, "Email or mobile number already exists");
            } else {
                let dataObj = {
                    firstName: req.body.firstName ? req.body.firstName : "",
                    lastName: req.body.lastName ? req.body.lastName : "",
                    email: req.body.email.toLowerCase()
                };
                // else create new user        
                const addData = await db.User.create(dataObj);
                console.log("jerjesrjkerjksdk-------------------", addData);
                const otpData = await sendOtp(req.body.email, addData.id);
                userLogger.info("otp sent to email and number");
                return response.successResponseWithData(res, "Otp sent to the registered mobile number and email", otpData);
            }
        } catch (err) {
            userLogger.error("Catch block error at user sign-up", err);
            return response.errorResponseWithData(res, "Something went wrong in first sign-up process", err);
        }
    }
];

exports.otpVerify = [
    body("email").trim().notEmpty().withMessage("email is required"),
    body("otp").trim().notEmpty().withMessage("otp is required"),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return response.errorResponseWithData(res, errors.array()[0]["msg"], errors.array());
            }
            const findUser = await db.User.findOne({
                where: {
                    email: req.body.email.toLowerCase()
                }
            })
            console.log(findUser.email, "to find email");

            if (findUser) {
                const data = await db.userOtp.update({
                    active: true
                }, {
                    where: { userId: findUser.id }
                })
                console.log(data);
                userLogger.info("otp verified")
                return response.successResponseWithData(res, "otp verified", data)
            } else {
                userLogger.error("unable to find email")
                return response.errorResponseWithData(res, "unable tofind email")
            }
        }
        catch (err) {
            console.log(err, "error");
            userLogger.error("Catch block error at user sign-up", err);
            return response.errorResponseWithData(res, "Something went wrong in first sign-up process", err);
        }
    }
]

exports.updateProfile = [
    body("email").trim().notEmpty().withMessage("email is required"),
    body("gender").trim().notEmpty().withMessage("gender is required"),
    body("DOB").trim().notEmpty().withMessage("DOB is required"),
    body("password").trim().notEmpty().withMessage("password is required"),
    body("seeking").trim().notEmpty().withMessage("seeking gender  is required"),
    body("country").trim().notEmpty().withMessage("country  is required"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return response.errorResponseWithData(res, errors.array()[0]["msg"], errors.array());
            }
            const findUser = await db.User.findOne({
                where: {
                    email: req.body.email.toLowerCase()
                }
            })
            console.log(findUser.email, "to find email");

            let data = {
                password: await utility.encyptPassword(req.body.password),
                gender: req.body.gender ? req.body.gender : "",
                DOB: req.body.DOB ? req.body.DOB : "",
                seeking: req.body.seeking ? req.body.seeking : "",
                country: req.body.country ? req.body.country : "",
                userId: findUser.id
            }

            console.log(data);

            if (findUser) {
                await db.userInfo.create(data)
                userLogger.info("user profile updated")
                return response.successResponseWithData(res, "user profile updated", data)
            }
            else {
                userLogger.error("user is not refgistered")
                return response.errorResponseWithData(res, "user is not registered")
            }

        } catch (err) {
            console.log(err);
            return response.errorResponseWithData(res, "error in catch block", err)
        }
    }
]

//login
exports.login = [
    body("email").trim().notEmpty().withMessage("email is required"),
    body("password").trim().notEmpty().withMessage("password is required"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return response.errorResponseWithData(res, errors.array()[0]["msg"], errors.array());
            }
            const findUser = await db.User.findOne({
                where: {
                    email: req.body.email.toLowerCase()
                }
            })
            console.log(findUser.email, "to find email");

            if (findUser) {
                var data = await db.userInfo.findOne({
                    password: req.body.password
                }, {
                    where: { userId: findUser.id }

                })
            }
            console.log(data.password);
            const compared = await utility.comparePassword(req.body.password, data.password);
            console.log("yes");
            if (compared) {
                let userData = {
                    id: findUser.id,
                    email: findUser.email
                };
                const token = utility.generateToken(userData);
                console.log(token, "token");
                userLogger.info("user login successfully");
                return response.successResponseWithData(res, "login successfully", token);
            } else {
                userLogger.error("password doesn't match")
                return response.errorResponse(res, "password did'nt match")
            }
        } catch (err) {
            console.log(err);
            userLogger.error("something went wrong in catch block")
            return response.errorResponseWithData(res, "something went wrong in catch block")
        }
    }
]

exports.latLong = [
    body("email").trim().notEmpty().withMessage("email is required"),
    body("latitude").trim().notEmpty().withMessage("latitude is required"),
    body("longitude").trim().notEmpty().withMessage("longitude is required"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return response.errorResponseWithData(res, errors.array()[0]["msg"], errors.array());
            }
            const findUser = await db.User.findOne({
                where: {
                    email: req.body.email.toLowerCase()
                }
            })
            console.log(findUser.email, "to find the email");
            var obj = {
                userId: findUser.id,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            }
            await db.location.create(obj)
            return response.successResponseWithData(res, "location updated", obj)
        } catch (err) {
            console.log(err);
            return response.errorResponse(res, "something went wrong in catch block")
        }
    }
]

const sendOtp = async (email, userid) => {
    try {
        console.log("email", email, userid);
        const otpForMail = utility.generateOTP(6);
        console.log(otpForMail, "otp here");




        // for both email and mobile number
        // if (email && email != "" && mobile_number && mobile_number != "") {
        //     await user.update({ email_otp: otpForMail, mobile_otp: otpForMobile }, { where: { email: email.toLowerCase(), mobile_number: mobile_number } });
        //     return { otpForMail: otpForMail, otpForMobile: otpForMobile };
        // }
        // for email only
        // for mobile number only
        // if (mobile_number && mobile_number != "") {
        //     await user.update({ mobile_otp: otpForMobile }, { where: { mobile_number: mobile_number } });
        //     return { otpForMobile: otpForMobile };
        // }

        console.log("email");
        await db.userOtp.create({ otp: otpForMail, userId: userid });
        // return { otpForMail: otpForMail };



        const html = "Please Confirm your Account. OTP: " + otpForMail;
        await utility.sendEmail('sfs.aman22@gmail.com', email, "Account Verification", html);

    } catch (err) {
        return err;
    }
};


exports.forgetPassword = [
    body("email").trim().notEmpty().withMessage("Email is required"),
    async (req, res) => {
        try {
            const error = validationResult(req);
            if (!error.isEmpty()) {
                return response.errorResponseWithData(res, error.array()[0]["msg"], error.array());
            }
            const findEmail = await db.User.findOne({ where: { email: req.body.email } });
            if (!findEmail) {
                userLogger.error("Email is not registered. forget password api for user");
                return response.errorResponse(res, "Email is not registered");
            }
            let obj = { type: "link for reset the password" };
            const token = utility.generateToken(obj);
            let url = "<a href=\"http://" + req.headers.host + "/user/get-ejs/" + token + "\">http://" + token + "</a>";
            //let url1 = '<a href="https://'+req.headers.host+'/password/ejs/'+tokn+'">https://'+tokn+'</a>';
            let link = "<p>You can change your password by clicking on the link below.</p>" + url + "<p>If you did not make this request. Please ignore this email.</p>";
            await utility.sendEmail("sfs.aman22@gmail.com", req.body.email, "Reset password link", link);
            userLogger.info("Link sent to the email. forget password api for user");
            return response.successResponse(res, "Link sent to the email");
        }
        catch (err) {
            userLogger.error("Catch block error at forget password api", err);
            return response.errorResponseWithData(res, "Something went wrong in forget password", err);
        }
    }
];

exports.imgUpload = [
    body("email").trim().notEmpty().withMessage("email is required"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return response.errorResponseWithData(res, errors.array()[0]["msg"], errors.array());
            }
            const findUser = await db.User.findOne({
                where: {
                    email: req.body.email.toLowerCase()

                }
            })
            console.log(findUser.id, "id ");

            console.log("files", req.files);
            if (findUser) {
                let file = req.files;
                for (let i = 0; i < file.length; i++) {
                    let obj = {
                        image: file[i].filename,
                        userId: findUser.id
                    }

                    await db.images.create(obj)
                }


                console.log("filers", req.files[0].filename);
                return response.successResponseWithData(res, "image uploaded")
            }
            else {
                console.log("unable to find email");
                return response.errorResponse(res, "unable to find the email")
            }
        } catch (err) {
            console.log("error", err);
            return response.errorResponse(res, "something went wrong in the catch block")
        }
    }
]
// resend otp

// exports.resendOtp = [
//     body("email").trim().notEmpty().withMessage("Email is required"),
//     async (req, res) => {
//         try {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return response.errorResponseWithData(res, errors.array()[0]["msg"], errors.array());
//             }
//             const findUser = await db.User.findOne({
//                 where: {
//                     email: req.body.email.toLowerCase()
//                 }
//             })
//             console.log(findUser.email, "to find email");

//             if (!findUser) {
//                 return response.errorResponse(res, "unable to find the user")
//             }
//             else{
//                 const otpData = await sendOtp(req.body.email, findUser.id);
//                 userLogger.info("otp sent to email and number");
//                 return response.successResponseWithData(res, "Otp sent to the registered mobile number and email", otpData);
//             }
//         } catch (err) {
// console.log(err, "error");
// return response.errorResponse(res,"something went wrong in catch block")
//         }
//     }
// ]
//reset password
exports.resetPassword = [
    body("email").trim().notEmpty().withMessage("Email is required"),
    body("new_password").trim().notEmpty().withMessage("New password is required"),
    body("confirm_password").trim().notEmpty().withMessage("Confirm password is required"),
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return response.errorResponseWithData(res, errors.array()[0]["msg"], errors.array());
            }
            // find user with email
            const findUser = await db.User.findOne({ where: { email: req.body.email } });
            if (!findUser) {
                userLogger.error("Email doesn't exists");
                return response.errorResponse(res, "Email doesn't exists");
            }
            // check if password is same
            if (req.body.new_password == req.body.confirm_password) {
                // encrypt password
                req.body.new_password = await utility.encyptPassword(req.body.new_password);
                // update password
                await user.update({ password: req.body.new_password }, { where: { id: findUser.id } });
                userLogger.info("Password updated successfully. Go to login page");
                return response.successResponse(res, "Password updated successfully. Go to login page");
            }
            userLogger.error("new password and confirm password must be same");
            return response.errorResponse(res, "new password and confirm password must be same");
        }
        catch (err) {
            userLogger.error("Catch block error at reset password api", err);
            return response.errorResponseWithData(res, "Something went wrong in reset password", err);
        }
    }
];

// delete image

exports.deleteImg = [
    body("email").trim().notEmpty().withMessage("email is required"),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return response.errorResponseWithData(res, errors.array()[0]["msg"], errors.array());
            }
            const findUser = await db.User.findOne({
                where: {
                    email: req.body.email.toLowerCase()

                }
            })
            console.log(findUser.id, "id ");

            if (findUser) {
                var data = await db.images.destroy({
                    where: { userId: findUser.id }

                })
            }
            console.log("data deleted successfully");
            return response.successResponseWithData(res, "data deleted successfully", data)

        } catch (err) {
            console.log(err, "error");
            return response.errorResponse(res, "something went wrong in catch block")
        }
    }
]

