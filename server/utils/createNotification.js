const Notification = require("../models/Notification");

const createNotification = async ({ user, sender, type, post, text }) => {
  try {
    if (!user || !sender) return;

    await Notification.create({
      user,
      sender,
      type,
      post,
      text,
    });
  } catch (err) {
    console.log("Notification Error:", err.message);
  }
};

module.exports = createNotification;
