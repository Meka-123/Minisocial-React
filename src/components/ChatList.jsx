import React from "react";
import { getDisplayName, getInitials } from "../utils/demoData.js";

export default function ChatList({ friends, chats, currentUser, selectedId, onSelect }) {
  return (
    <section className="card chat-list" aria-label="Your chats">
      <h2 className="section-title">Your chats</h2>
      {friends.length === 0 ? (
        <p className="empty-copy">Add a friend to start a conversation.</p>
      ) : (
        <ul className="chat-people">
          {friends.map((friend) => {
            const chat = chats.find((item) => item.participantIds.includes(currentUser.id) && item.participantIds.includes(friend.id));
            const lastMessage = chat?.messages.at(-1)?.text;
            return (
              <li key={friend.id}>
                <button type="button" className={`chat-person${selectedId === friend.id ? " selected" : ""}`} onClick={() => onSelect(friend.id)}>
                  <span className="avatar">{getInitials(getDisplayName(friend))}</span>
                  <span className="chat-person-details">
                    <strong>{getDisplayName(friend)}</strong>
                    <span className="online-label"><span className="status-dot" />Demo online</span>
                    {lastMessage && <span className="chat-preview">{lastMessage}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
      <p className="demo-note">Online labels are simulated for this prototype.</p>
    </section>
  );
}
