import React, { useState } from "react";
import PostCard from "../components/PostCard.jsx";
import { createId } from "../utils/storage.js";

export default function Feed({ appData, onChange, currentUser }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const posts = [...appData.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  function submit(event) {
    event.preventDefault();
    const cleanText = text.trim();
    if (!cleanText) {
      setError("Write something before posting.");
      return;
    }
    const post = { id: createId(), authorId: currentUser.id, text: cleanText, createdAt: new Date().toISOString(), likes: [], reposts: [], comments: [] };
    onChange({ ...appData, posts: [post, ...appData.posts] });
    setText("");
    setError("");
  }

  return (
    <div className="content-column">
      <div className="page-heading"><div><p className="eyebrow">YOUR COMMUNITY</p><h1>Your feed</h1></div><p className="muted">Share a thought with your friends.</p></div>
      <form className="card composer" onSubmit={submit}>
        <label htmlFor="post-text">What’s on your mind, {currentUser.name.split(/\s+/)[0]}?</label>
        <textarea id="post-text" value={text} onChange={(event) => setText(event.target.value)} placeholder="Write a post..." maxLength={2000} rows={3} />
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="composer-footer"><span className="muted small-text">{text.length}/2000</span><button type="submit" className="button" disabled={!text.trim()}>Share post</button></div>
      </form>
      <section className="feed-list" aria-label="Recent posts">
        {posts.length ? posts.map((post) => <PostCard key={post.id} post={post} users={appData.users} currentUser={currentUser} appData={appData} onChange={onChange} />) : (
          <div className="card empty-state"><span className="empty-icon" aria-hidden="true">✦</span><h2>Your feed starts here</h2><p>Share the first post, then invite a friend to join you.</p></div>
        )}
      </section>
    </div>
  );
}
