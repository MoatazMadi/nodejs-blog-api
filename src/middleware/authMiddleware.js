const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { request } = require("express");
const myError = require("../utils/myError");
dotenv.config();

const auth = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) throw myError(401, "invalid token");

    const jwtsecret = process.env.JWT_SECRET;

    jwt.verify(token, jwtsecret, (err, user) => {
      if (err) throw myError(401, "unauthorize token");
      req.user = user;
      next();
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { auth };
