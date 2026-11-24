import React from "react";
export default function MessageBubble({ message, isMine }) {
  return (
    <div className={`message-row${isMine ? " mine" : ""}`}>
      <p className="message-bubble">{message.text}<time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time></p>
    </div>
  );
}
