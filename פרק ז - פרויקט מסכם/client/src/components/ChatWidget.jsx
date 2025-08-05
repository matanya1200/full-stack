import React, { useState, useRef, useEffect } from "react";
import aiChatService from "../services/aiChatService";

export default function ChatWidget({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  /*useEffect(() => {
    if (open) setMessages([]);
  }, [open]);*/

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    const res = await aiChatService.sendMessage([...messages, userMsg]);
    setMessages((msgs) => [...msgs, { role: "model", text: res }]);
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        right: "100px",
        width: "350px",
        height: "450px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
        zIndex: 1001,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "12px", background: "#1976d2", color: "#fff", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        AI Chat
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer" }}>&times;</button>
      </div>
      <div style={{ flex: 1, padding: "12px", overflowY: "auto", background: "#f5f5f5" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: "10px", textAlign: msg.role === "user" ? "right" : "left" }}>
            <span
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "12px",
                background: msg.role === "user" ? "#1976d2" : "#e0e0e0",
                color: msg.role === "user" ? "#fff" : "#333",
                maxWidth: "80%",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div style={{ padding: "12px", borderTop: "1px solid #eee", display: "flex" }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          style={{ flex: 1, borderRadius: "8px", border: "1px solid #ccc", padding: "8px" }}
          placeholder="Ask about products..."
        />
        <button
          onClick={sendMessage}
          style={{ marginLeft: "8px", background: "#1976d2", color: "#fff", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer" }}
        >
          Send
        </button>
      </div>
    </div>
  );
}