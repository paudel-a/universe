const express = require("express");
const Message = require("../models/Message");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// ======================
// SEND MESSAGE
// ======================
router.post("/", auth, async (req, res) => {
  try {
    const { receiver, text } = req.body;

    if (!receiver || !text) {
      return res.status(400).json({
        msg: "Receiver and text are required",
      });
    }

    const message = await Message.create({
      sender: req.user.id, // ✅ from token
      receiver,
      text,
    });

    res.status(201).json(message);
  } catch (err) {
    console.log("SEND MESSAGE ERROR:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

// ======================
// GET CHAT HISTORY
// ======================
router.get("/:userId", auth, async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        {
          sender: req.user.id,
          receiver: otherUserId,
        },
        {
          sender: otherUserId,
          receiver: req.user.id,
        },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.log("GET MESSAGES ERROR:", err);
    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
