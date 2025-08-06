
import { useState, useRef, useEffect } from "react";
import aiChatService from "../../services/aiChatService";
import DOMPurify from 'dompurify';
import './ChatWidget.css';

export default function ChatWidget({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const formatText = (input) => {
    // Handle multiline code blocks: ```lang\ncode\n```
    input = input.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
        lang = lang || '';
        code = code.replace(/</g, '&lt;').replace(/>/g, '&gt;'); // Escape HTML
        return `<pre><code class="language-${lang}">${code}</code></pre>`;
    });

    // Escape < > to avoid breaking HTML (except inside code blocks)
    input = input.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Inline code: `code`
    input = input.replace(/`([^`\n]+?)`/g, '<code>$1</code>');

    // Bold: **bold**
    input = input.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Italic: *italic* (but not inside bold)
    input = input.replace(/(^|[^*])\*([^*\n]+?)\*/g, '$1<em>$2</em>');

    // Replace newlines with <br>, unless inside <pre>
    input = input.replace(/(?<!<\/pre>)\n/g, '<br>');

    return input;
  }

  const safeHtmlFromString = (input) => {
    const rawHtml = formatText(input);
    return DOMPurify.sanitize(rawHtml);
  }

  // Handler to clear chat messages
  const handleClearChat = () => setMessages([]);

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
    <div className="chat-widget">
      <div className="chat-widget-header">
        AI Chat
        <button
          className="chat-widget-option"
          onClick={handleClearChat}
          title="Clean chat"
        >
          🗑️
        </button>
        <button className="chat-widget-option" onClick={onClose}>&times;</button>
      </div>
      <div className="chat-widget-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`chat-widget-message ${msg.role}`}>
            <span
              className={`chat-widget-bubble ${msg.role}`}
              dangerouslySetInnerHTML={{ __html: safeHtmlFromString(msg.text) }}
            >
            </span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-widget-input-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          className="chat-widget-input"
          placeholder="שאל על מוצרים..."
        />
        <button
          onClick={sendMessage}
          className="chat-widget-send me-2 ms-0"
        >
          שלח
        </button>
      </div>
    </div>
  );
}