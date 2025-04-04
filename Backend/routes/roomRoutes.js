// routes/roomRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Room = require("../models/Room");
const Message = require("../models/Message");

// Configure Multer storage for room images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Create a new room
router.post("/rooms", upload.single("image"), async (req, res) => {
  try {
    const { name } = req.body;
    let imagePath = "";
    if (req.file) {
      imagePath = req.file.path;
    }
    const newRoom = new Room({ name, image: imagePath, count: 0 });
    await newRoom.save();
    res.json(newRoom);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all rooms with unique user count
router.get("/rooms", async (req, res) => {
  try {
    const rooms = await Room.find();
    const roomsWithCount = await Promise.all(
      rooms.map(async (room) => {
        // Get distinct senderIds from messages for this room
        const uniqueUsers = await Message.distinct("senderId", { room: room._id });
        return { ...room.toObject(), count: uniqueUsers.length };
      })
    );
    res.json(roomsWithCount);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a room by ID (admin functionality)
router.delete("/rooms/:id", async (req, res) => {
  try {
    const roomId = req.params.id;
    // Remove the room
    const deletedRoom = await Room.findByIdAndDelete(roomId);
    if (!deletedRoom) {
      return res.status(404).json({ error: "Room not found" });
    }
    // Optionally, delete all messages associated with this room
    await Message.deleteMany({ room: roomId });
    res.json({ message: "Room deleted successfully", room: deletedRoom });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
