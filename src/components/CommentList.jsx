import React from "react";
import { getDisplayName, getInitials } from "../utils/demoData.js";

export default function CommentList({ comments, users }) {
  if (comments.length === 0) return null;
  return (
    <ul className="comment-list" aria-label="Comments">
      {comments.map((comment) => {
        const author = users.find((user) => user.id === comment.authorId);
        return (
          <li className="comment-item" key={comment.id}>
            <span className="avatar avatar-small">{getInitials(getDisplayName(author))}</span>
            <div className="comment-content">
              <strong>{getDisplayName(author)}</strong>
              <p>{comment.text}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
