import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import ChatList from "../components/ChatList.jsx";
import MessageBubble from "../components/MessageBubble.jsx";
import { areFriends, getDisplayName, getInitials } from "../utils/demoData.js";
import { commitAppData, createId } from "../utils/storage.js";

export default function Chats({ appData, onChange, currentUser }) {
  const location = useLocation();
  const friends = useMemo(() => appData.users.filter((user) => user.id !== currentUser.id && areFriends(appData.friendships, currentUser.id, user.id)), [appData.users, appData.friendships, currentUser.id]);
  const [selectedId, setSelectedId] = useState(location.state?.friendId || "");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const selectedFriend = friends.find((friend) => friend.id === selectedId) ?? null;
  const activeChat = appData.chats.find((chat) => chat.participantIds.includes(currentUser.id) && chat.participantIds.includes(selectedId));

  useEffect(() => {
    if (location.state?.friendId) setSelectedId(location.state.friendId);
  }, [location.state]);

  function sendMessage(event) {
    event.preventDefault();
    const cleanText = text.trim();
    if (!cleanText || !selectedFriend) {
      if (!cleanText) setError("Write a message before sending.");
      return;
    }
    const message = { id: createId(), senderId: currentUser.id, text: cleanText, createdAt: new Date().toISOString() };
    const nextChats = activeChat
      ? appData.chats.map((chat) => chat.id === activeChat.id ? { ...chat, messages: [...chat.messages, message] } : chat)
      : [...appData.chats, { id: createId(), participantIds: [currentUser.id, selectedFriend.id], messages: [message] }];
    onChange(commitAppData({ ...appData, chats: nextChats }));
    setText("");
    setError("");
  }

  return (
    <div className={`chat-layout${selectedFriend ? " chat-open" : ""}`}>
      <ChatList friends={friends} chats={appData.chats} currentUser={currentUser} selectedId={selectedId} onSelect={setSelectedId} />
      <section className="card conversation" aria-label="Conversation">
        {selectedFriend ? (
          <>
            <header className="conversation-header">
              <button type="button" className="button button-quiet mobile-back" onClick={() => setSelectedId("")}>← Chats</button>
              <span className="avatar">{getInitials(getDisplayName(selectedFriend))}</span>
              <div><h1>{getDisplayName(selectedFriend)}</h1><span className="online-label"><span className="status-dot" />Demo online</span></div>
            </header>
            <div className="message-list" aria-live="polite">
              {(activeChat?.messages ?? []).length ? activeChat.messages.map((message) => <MessageBubble key={message.id} message={message} isMine={message.senderId === currentUser.id} />) : (
                <div className="empty-state chat-empty"><span className="empty-icon" aria-hidden="true">✉</span><h2>Say hello</h2><p>Send your first message to {selectedFriend.name.split(/\s+/)[0]}.</p></div>
              )}
            </div>
            <form className="message-form" onSubmit={sendMessage}>
              <label className="sr-only" htmlFor="message-text">Write a message</label>
              <input id="message-text" value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a message..." maxLength={2000} />
              <button type="submit" className="button" disabled={!text.trim()}>Send</button>
            </form>
            {error && <p className="form-error message-error" role="alert">{error}</p>}
          </>
        ) : (
          <div className="empty-state conversation-placeholder"><span className="empty-icon" aria-hidden="true">✉</span><h2>Your conversations</h2><p>Select a friend to start chatting.</p></div>
        )}
      </section>
    </div>
  );
}
