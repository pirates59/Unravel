// middleware/upload.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the uploads directory exists; create it if it doesn't
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  // Set destination to uploads folder
  destination: (req, file, cb) => cb(null, uploadDir),
  // Generate a unique filename using the current timestamp and original extension
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

// Initialize multer with the defined storage settings
const upload = multer({ storage });

module.exports = upload;
