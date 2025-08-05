import React from "react";

export default function ChatIcon({ onClick }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 1000,
        cursor: "pointer",
        background: "#1976d2",
        borderRadius: "50%",
        width: "56px",
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}
      onClick={onClick}
      aria-label="Open chat"
    >
      <svg width="32" height="32" fill="#fff" viewBox="0 0 24 24">
        <path d="M12 3C7.03 3 3 6.58 3 11c0 2.39 1.19 4.53 3.17 6.13L5 21l4.13-1.17C10.47 20.61 11.23 21 12 21c4.97 0 9-3.58 9-8s-4.03-8-9-8zm0 16c-.62 0-1.23-.09-1.81-.26l-.36-.11-.36.11-2.44.69.69-2.44.11-.36-.11-.36C5.09 15.23 4 13.21 4 11c0-3.31 3.58-6 8-6s8 2.69 8 6-3.58 6-8 6z"/>
      </svg>
    </div>
  );
}