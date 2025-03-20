// middleware/upload.js
const multer = require("multer");
const path = require("path");

// Seting up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Define where to store files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

// file filter for specific file types (optional)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG, and GIF are allowed"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
   },
});

module.exports = {upload};
