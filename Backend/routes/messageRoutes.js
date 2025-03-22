const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Room = require("../models/Room");

// GET all messages for a given room
router.get("/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ room: roomId }).sort({ createdAt: 1 });
    return res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

// POST a new message to a given room
router.post("/rooms/:roomId/messages", async (req, res) => {
  try {
    const { roomId } = req.params;
    const { sender, text } = req.body;

    // Check if room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Create the user message
    const userMessage = new Message({
      room: roomId,
      sender,
      text,
    });
    await userMessage.save();

    // For demo: automatically respond with a BOT message
    const botMessage = new Message({
      room: roomId,
      sender: "BOT",
      text: "Lorem ipsum has been the industry's standard dummy text...",
    });
    await botMessage.save();

    // If using Socket.IO, broadcast the new messages to clients in this room:
    global.io.to(roomId).emit("newMessage", userMessage);
    global.io.to(roomId).emit("newMessage", botMessage);

    return res.json([userMessage, botMessage]);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
