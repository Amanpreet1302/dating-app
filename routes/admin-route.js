const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin-controller");
const middleware = require("../middleware/jwtVerify");


module.exports = router;