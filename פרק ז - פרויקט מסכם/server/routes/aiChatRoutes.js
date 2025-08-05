const express = require("express")
const { getGeminiReply } = require("../ai/geminiChat.js");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;
    
    const reply = await getGeminiReply(messages);
    
    res.json({ reply });
  } catch (err) {    
    res.status(500).json({ error: "AI chat error" });
  }
});

module.exports = router;