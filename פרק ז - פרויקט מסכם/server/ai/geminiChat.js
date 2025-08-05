const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

function extract_csv(pathname) {
  let parts = [{ text: `---- START OF CSV ${pathname} ----` }];
  const data = fs.readFileSync(pathname, "utf8");
  data.split("\r\n").forEach(row => {
    parts.push({ text: row.replaceAll(",", " ") });
  });
  return parts;
}

const productsCsvPath = path.join(__dirname, "../../insert_products.csv");
const csvParts = extract_csv(productsCsvPath);

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getGeminiReply(messages) {  
  const history = [
    { role: "user", parts: csvParts },
    ...messages.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }))
  ];

  const convo = ai.chats.create({
    model: "gemini-2.5-flash",
    history
  });

  try {
    
    const result = await convo.sendMessage({message: messages[messages.length - 1].text});
    return result.text;
  } catch (err) {
    console.error("Gemini sendMessage error:", err);
    throw err;
  }
}

module.exports = { getGeminiReply };