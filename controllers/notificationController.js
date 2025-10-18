

import Notification from "../models/NotificationModel.js";

//  Create a notification
export const createNotification = async (userId, title, message, type = "general") => {
  try {
    const newNotification = new Notification({
      user: userId,
      title,
      message,
      type,
    });
    await newNotification.save();
    return newNotification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

//  Get all notifications for a user
export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

//  Mark a notification as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { isRead: true });
    res.status(200).json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
};

//  Clear all notifications
export const clearAllNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    await Notification.deleteMany({ user: userId });
    res.status(200).json({ message: "All notifications cleared" });
  } catch (error) {
    res.status(500).json({ message: "Error clearing notifications", error });
  }
};
