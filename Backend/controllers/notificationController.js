// controllers/notificationController.js
const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    // Change query to use recipient as stored in the notification.
    // (Alternatively, if you store recipient as an id, query by recipient id.)
    const userName = req.user.username;
    // Populate actorId to get the latest name and profile image from the Signup collection.
    const notifications = await Notification.find({ recipient: userName })
      .sort({ createdAt: -1 })
      .populate("actorId", "name profileImage");
    // If populated, override actorName and actorProfileImage with the current values.
    const updatedNotifications = notifications.map((n) => {
      if (n.actorId) {
        return {
          ...n.toObject(),
          actorName: n.actorId.name,
          actorProfileImage: n.actorId.profileImage,
        };
      }
      return n;
    });
    res.json({ notifications: updatedNotifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const userName = req.user.username;
    await Notification.updateMany({ recipient: userName, state: false }, { state: true });
    res.json({ message: "All notifications marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markSingleAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    await Notification.findByIdAndUpdate(notificationId, { state: true });
    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
