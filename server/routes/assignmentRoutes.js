const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");

// CREATE assignment (teacher)
router.post("/", async (req, res) => {
  try {
    const assignment = await Assignment.create(req.body);
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all assignments
router.get("/", async (req, res) => {
  try {
    const data = await Assignment.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
