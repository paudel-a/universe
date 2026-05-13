const express = require("express");
const router = express.Router();
const Submission = require("../models/Submission");

// submit assignment
router.post("/", async (req, res) => {
  try {
    const submission = await Submission.create(req.body);
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get submissions for assignment
router.get("/:assignmentId", async (req, res) => {
  try {
    const data = await Submission.find({
      assignmentId: req.params.assignmentId,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
