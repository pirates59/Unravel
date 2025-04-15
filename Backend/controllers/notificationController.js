// controllers/notificationController.js
const Notification = require('../models/Notification');

// Fetch and return notifications for the authenticated user
exports.getNotifications = async (req, res) => {
  try {
    // Get current user's username from request (set by authentication middleware)
    const userName = req.user.username;
    // Query notifications for this user, sorted by most recent, and populate actor details
    const notifications = await Notification.find({ recipient: userName })
      .sort({ createdAt: -1 })
      .populate('actorId', 'name profileImage');

    // Replace actor fields with populated values if available
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

    // Respond with the processed notifications array
    res.json({ notifications: updatedNotifications });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({ error: error.message });
  }
};

// Mark all unread notifications as read for the authenticated user
exports.markAllAsRead = async (req, res) => {
  try {
    const userName = req.user.username;
    await Notification.updateMany(
      { recipient: userName, state: false },
      { state: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark a single notification as read by its ID
exports.markSingleAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    await Notification.findByIdAndUpdate(notificationId, { state: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
