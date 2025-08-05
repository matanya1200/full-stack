const API_URL = "http://localhost:3000/api/ai-chat";

const sendMessage = async (messages) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  const data = await res.json();
  return data.reply;
};

export default { sendMessage };