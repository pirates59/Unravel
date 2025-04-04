// controllers/notificationController.js
const Notification = require("../models/Notification");

// Get notifications for the logged-in user (using username instead of id)
exports.getNotifications = async (req, res) => {
  try {
    // Use req.user.username to match the notifications’ recipient
    const userName = req.user.username;
    const notifications = await Notification.find({ recipient: userName }).sort({ createdAt: -1 });
    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark all notifications as read for the logged-in user (using username)
exports.markAllAsRead = async (req, res) => {
  try {
    const userName = req.user.username;
    await Notification.updateMany({ recipient: userName, state: false }, { state: true });
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark a single notification as read (by notification id)
exports.markSingleAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    await Notification.findByIdAndUpdate(notificationId, { state: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
