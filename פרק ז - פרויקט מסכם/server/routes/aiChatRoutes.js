const express = require("express")
const { getGeminiReply } = require("../ai/geminiChat.js");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;
    console.log("processed body");
    
    const reply = await getGeminiReply(messages);
    console.log("called function");
    
    res.json({ reply });
  } catch (err) {    
    res.status(500).json({ error: "AI chat error" });
  }
});

module.exports = router;