const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Room = require("../models/Room");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // e.g. "1679331230123.png"
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// @route POST /rooms
// @desc  Create a new room
router.post("/rooms", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    let imagePath = "";

    if (req.file) {
      imagePath = req.file.path; 
    }

    const newRoom = new Room({
      name,
      image: imagePath,
      count: 0,
    });
    await newRoom.save();
    return res.json(newRoom);
  } catch (error) {
    console.error("Error creating room:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// @route GET /rooms
// @desc  Get all rooms
router.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    return res.json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
