const User = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const mkdirp = require("mkdirp");
const fs = require("fs").promises;
const dotenv = require("dotenv");
const { validateUser } = require("../utils/validators/userValidate");
const myError = require("../utils/myError");

dotenv.config();

// login
const login = async (req, res, next) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });

    if (!user) throw myError(400, "invalid user name or password");

    const resault = await bcrypt.compare(password.toString(), user.password);

    if (!resault) throw myError(400, "invalid password or usrr name");

    const jwtSecret = process.env.JWT_SECRET;

    const token = jwt.sign(
      { id: user.id, name: user.name, img: user.img },
      jwtSecret,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      data: {
        token,
        status: 200,
      },
    });
  } catch (err) {
    next(err);
  }
};
// register
const register = async (req, res, next) => {
  try {
    const { userName } = req.body;

    let createUser = {
      ...req.body,
    };

    // Validate the user input
    const { error } = validateUser(createUser);

    // If validation errors exist, return the errors to the client
    if (error) {
      throw myError(400, error.message);
    }

    const findUser = await User.findOne({ userName });
    if (findUser) {
      throw myError(400, "invalid userName try another one");
    }
    // If file is uploaded, process it
    if (req.file) {
      const usersPath = path.join(__dirname, "../../public/imgs/usersimgs");
      await mkdirp(usersPath);
      const targetPath = path.join(usersPath, req.file.filename);
      // Copy the file to the new location
      await fs.copyFile(req.file.path, targetPath);
      // delete
      await fs.unlink(req.file.path);
      createUser.img = targetPath;
    }

    const user = await User.create(createUser);

    const jwtSecret = process.env.JWT_SECRET;
    const token = jwt.sign(
      { id: user.id, name: user.name, img: user.img },
      jwtSecret,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      data: {
        token,
        message: "user created.",
        status: 201,
      },
    });
  } catch (err) {
    next(err); // Pass any error to error handling middleware
  }
};

module.exports = {
  login,
  register,
};
