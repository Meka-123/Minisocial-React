import React, { useState } from "react";
import CommentList from "./CommentList.jsx";
import { getDisplayName, getInitials } from "../utils/demoData.js";
import { createId } from "../utils/storage.js";

export default function PostCard({ post, users, currentUser, appData, onChange }) {
  const [commentText, setCommentText] = useState("");
  const author = users.find((user) => user.id === post.authorId);
  const liked = post.likes.includes(currentUser.id);
  const reposted = post.reposts.includes(currentUser.id);

  function updatePost(transform) {
    const nextData = {
      ...appData,
      posts: appData.posts.map((item) => item.id === post.id ? transform(item) : item),
    };
    onChange(nextData);
  }

  function toggleLike() {
    updatePost((item) => ({
      ...item,
      likes: liked ? item.likes.filter((id) => id !== currentUser.id) : [...item.likes, currentUser.id],
    }));
  }

  function toggleRepost() {
    updatePost((item) => ({
      ...item,
      reposts: reposted ? item.reposts.filter((id) => id !== currentUser.id) : [...item.reposts, currentUser.id],
    }));
  }

  function submitComment(event) {
    event.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    updatePost((item) => ({
      ...item,
      comments: [...item.comments, { id: createId(), authorId: currentUser.id, text, createdAt: new Date().toISOString() }],
    }));
    setCommentText("");
  }

  return (
    <article className="card post-card">
      <div className="post-heading">
        <span className="avatar">{getInitials(getDisplayName(author))}</span>
        <div>
          <strong>{getDisplayName(author)}</strong>
          <time className="muted small-text" dateTime={post.createdAt}>{new Date(post.createdAt).toLocaleString()}</time>
        </div>
      </div>
      <p className="post-text">{post.text}</p>
      <div className="post-actions" aria-label="Post actions">
        <button type="button" className={`action-button${liked ? " selected" : ""}`} aria-pressed={liked} onClick={toggleLike}>
          {liked ? "♥ Liked" : "♡ Like"} <span>{post.likes.length}</span>
        </button>
        <button type="button" className={`action-button${reposted ? " selected" : ""}`} aria-pressed={reposted} onClick={toggleRepost}>
          {reposted ? "↻ Reposted" : "↻ Repost"} <span>{post.reposts.length}</span>
        </button>
        <span className="action-count">{post.comments.length} {post.comments.length === 1 ? "comment" : "comments"}</span>
      </div>
      <CommentList comments={post.comments} users={users} />
      <form className="comment-form" onSubmit={submitComment}>
        <label className="sr-only" htmlFor={`comment-${post.id}`}>Write a comment</label>
        <input id={`comment-${post.id}`} value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Write a comment..." maxLength={500} />
        <button type="submit" className="button button-small" disabled={!commentText.trim()}>Comment</button>
      </form>
    </article>
  );
}
