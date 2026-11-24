import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getDisplayName, getInitials, areFriends } from "../utils/demoData.js";
import { commitAppData, createId } from "../utils/storage.js";

export default function Friends({ appData, onChange, currentUser }) {
  const [query, setQuery] = useState("");
  const friends = appData.users.filter((user) => user.id !== currentUser.id && areFriends(appData.friendships, currentUser.id, user.id));
  const results = useMemo(() => appData.users.filter((user) =>
    user.id !== currentUser.id &&
    !areFriends(appData.friendships, currentUser.id, user.id) &&
    `${user.name} ${user.email}`.toLowerCase().includes(query.trim().toLowerCase()),
  ), [appData.users, appData.friendships, currentUser.id, query]);

  function addFriend(friendId) {
    const friendship = { id: createId(), userId: currentUser.id, friendId };
    onChange(commitAppData({ ...appData, friendships: [...appData.friendships, friendship] }));
  }

  return (
    <div className="content-column">
      <div className="page-heading"><div><p className="eyebrow">MEET YOUR PEOPLE</p><h1>Friends</h1></div></div>
      <section className="card friends-search">
        <label htmlFor="friend-search">Find people by name or email</label>
        <input id="friend-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search accounts in this browser" />
        <p className="demo-note">Only accounts created in this browser can be discovered.</p>
      </section>
      {friends.length > 0 && (
        <section className="friends-section">
          <h2 className="section-title">Your friends <span className="count-pill">{friends.length}</span></h2>
          <ul className="people-grid">{friends.map((friend) => (
            <li className="card person-card" key={friend.id}>
              <span className="avatar avatar-large">{getInitials(getDisplayName(friend))}</span>
              <div className="person-info"><strong>{getDisplayName(friend)}</strong><span className="muted">{friend.email}</span></div>
              <Link className="button button-secondary button-small" to="/chats" state={{ friendId: friend.id }}>Message</Link>
            </li>
          ))}</ul>
        </section>
      )}
      <section className="friends-section">
        <h2 className="section-title">Discover people</h2>
        {results.length ? <ul className="people-grid">{results.map((person) => (
          <li className="card person-card" key={person.id}>
            <span className="avatar avatar-large">{getInitials(getDisplayName(person))}</span>
            <div className="person-info"><strong>{getDisplayName(person)}</strong><span className="muted">{person.email}</span></div>
            <button type="button" className="button button-small" onClick={() => addFriend(person.id)}>Add friend</button>
          </li>
        ))}</ul> : <div className="card empty-compact"><p>{query ? "No accounts match your search." : "No new people to discover yet. Another person can sign up on this browser."}</p></div>}
      </section>
    </div>
  );
}
