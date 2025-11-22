const Notification = require('../models/Notification');

// Screen 10: Notifications
exports.getNotifications = async (req, res) => {
  const notifs = await Notification.find({ kid: req.params.kidId }).sort({ createdAt: -1 });
  res.json({ success: true, data: notifs });
};