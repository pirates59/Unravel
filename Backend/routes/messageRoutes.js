// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Room = require("../models/Room");

// Get all messages for a room
router.get("/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ room: roomId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Post a new message in a room
router.post("/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    // Destructure senderEmail along with the other fields
    const { senderId, senderName, senderEmail, senderImage, text } = req.body;
    // Ensure room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    // Create and save the user's message, including the senderEmail field.
    const userMessage = new Message({
      room: roomId,
      senderId,
      senderName,
      senderEmail,
      senderImage,
      text,
    });
    await userMessage.save();

    // Broadcast the message to clients in the room via Socket.IO
    global.io.to(roomId).emit("newMessage", userMessage);

    res.json(userMessage);
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
