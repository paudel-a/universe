const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

let groq = null;
if (process.env.GROQ_API_KEY) {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
} else {
  console.warn("⚠️  GROQ_API_KEY not set — /api/ai/chat will return 503");
}

// POST /api/ai/chat
router.post("/chat", async (req, res) => {
  if (!groq) {
    return res.status(503).json({ msg: "AI service not configured" });
  }

  try {
    const { message } = req.body;

    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful study assistant for university students. Explain things simply.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "AI error" });
  }
});

module.exports = router;
