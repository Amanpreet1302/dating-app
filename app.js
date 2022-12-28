/* eslint-disable quotes */
const express = require("express");
const app = express();
app.use(express.json());
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const cors = require("cors");
app.use(cors());
require("dotenv").config();
const swaggerUi = require("swagger-ui-express"),
swaggerDocument = require("./swagger.json");
    // for swagger ui
app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument));

app.use("/public", express.static("public"));

// set ejs as templating engine
app.set("view engine", "ejs");
const userRoutes = require("./routes/user-route");
app.use("/user",userRoutes);

const adminRoutes = require("./routes/admin-route");
app.use("/admin", adminRoutes);

app.get('/dollarping', (req, res) => {
    res.send('Hello World, from express');
});

app.listen(process.env.PORT, () => {
    console.log("Server listening on:", process.env.PORT);
});