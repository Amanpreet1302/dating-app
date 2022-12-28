/* eslint-disable no-unused-vars */
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const AWS = require("aws-sdk");
const multer3 = require("multer-s3");

const storage=multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,"./public/images");
    },
    filename:function(req,file,callback){
        callback(null,file.fieldname+"-"+Date.now() + path.extname(file.originalname));
    }
});
// allow only jpg,jpeg or png file to upload
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/JPEG" ||file.mimetype === "image/JPG" || file.mimetype === "image/PNG") {
    cb(null, true);
    } else {
    cb(new Error("Invalid file type, only JPEG, JPG and PNG is allowed!"), false);
    }
};
// s3 configuration
// const s3=new AWS.S3({
//     accessKeyId:process.env.BUCKET_ACCESS_ID,
//     secretAccessKey:process.env.BUCKET_SECRET_KEY
// });
// upload images to server bucket
// const uploadAtServer = multer({fileFilter,storage:multer3({
//     s3:s3,
//     bucket:process.env.BUCKET_NAME,
//     metadata:function(req,file,cb){
//         cb(null,{fieldName:"TESTING_METADATA"});
//     },
//     contentType:multer3.AUTO_CONTENT_TYPE,
//     key:function(req,file,cb){
//         cb(null,Date.now().toString()+path.extname(file.originalname));
//     }
// })});
module.exports = {
    // function to generate otp
    generateOTP : (length)=> {
        let text = "";
        let possible = "123456789";
        for (let i = 0; i < length; i++) {
            let sup = Math.floor(Math.random() * possible.length);
            text += i > 0 && sup == i ? "0" : possible.charAt(sup);
        }
        return Number(text);
    },
    // function for sending mail
    sendEmail : async(from, to, subject, html) =>{
        let transporter = nodemailer.createTransport({
             host:"smtp.mailtrap.io",
             port: 2525,
            //secure:true,
            //service:'gmail',
            auth:{
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS
            }
        }); 
         transporter.sendMail({
            from: "sfs.aman22@gmail.com",
            to: to,
            subject: subject,
            html: html
        });
    },


    // function to generate token
    generateToken: (data)=>{
        return jwt.sign(data,process.env.SECRET);
    },

    // function to authenticate token
    verifyToken:(token)=>{
        return jwt.verify(token, process.env.SECRET);
    },

    //function for password encryption
    encyptPassword:async(password)=>{
        return bcrypt.hash(password,+process.env.SALTROUNDS);   
    },

    //function to compare password
    comparePassword:async(password,hash)=>{
        return await bcrypt.compare(password,hash);
    },
    // image uploading using multer
  profile:multer({storage:storage })
};