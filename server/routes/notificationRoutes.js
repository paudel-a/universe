const express = require("express");
const router = express.Router();

const Notification = require("../models/Notification");
const auth = require("../middleware/authMiddleware");

// =======================
// GET MY NOTIFICATIONS
// =======================
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    })
      .populate("sender", "name email")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.log("GET NOTIFICATIONS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// =======================
// MARK AS READ
// =======================
router.put("/read/:id", auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ msg: "Notification not found" });
    }

    // security check
    if (notification.user.toString() !== req.user) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    notification.isRead = true;
    await notification.save();

    res.json(notification);
  } catch (error) {
    console.log("MARK READ ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

// =======================
// MARK ALL AS READ (optional but powerful)
// =======================
router.put("/read-all", auth, async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user }, { isRead: true });

    res.json({ msg: "All notifications marked as read" });
  } catch (error) {
    console.log("MARK ALL READ ERROR:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
