const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages) return res.status(400).json({ error: "Missing messages" });
    
    // Dynamically import the ESM module
    const { getRagAnswer } = await import("../ai/rag/ragChat.js");
    const reply = await getRagAnswer(messages);    

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;