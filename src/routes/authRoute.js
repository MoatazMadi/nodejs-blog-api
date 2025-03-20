const express = require("express");
const authRouter = express.Router();
const {upload} = require("../utils/storage");


const authController = require("../controllers/authController");
// login
authRouter.post("/login", authController.login);
// register
authRouter.post("/register",upload.single("img"), authController.register);

module.exports = authRouter;
