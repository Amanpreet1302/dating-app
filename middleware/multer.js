const express = require('express')
const multer  = require('multer')
const path = require("path");

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

module.exports = {
    profile:multer({storage:storage })
}