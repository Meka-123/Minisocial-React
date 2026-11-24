import React, { useState } from "react";
import { commitAppData, normalizeEmail } from "../utils/storage.js";
import { getInitials } from "../utils/demoData.js";

export default function Profile({ appData, onChange, currentUser }) {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function submit(event) {
    event.preventDefault();
    const cleanName = name.trim();
    const normalizedEmail = normalizeEmail(email);
    if (!cleanName) {
      setError("Your name cannot be empty.");
      setMessage("");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      setMessage("");
      return;
    }
    if (appData.users.some((user) => user.id !== currentUser.id && user.email === normalizedEmail)) {
      setError("Another account already uses that email.");
      setMessage("");
      return;
    }
    if (password && password.trim().length < 8) {
      setError("A new password must have at least 8 characters.");
      setMessage("");
      return;
    }
    const updatedUser = { ...currentUser, name: cleanName, email: normalizedEmail };
    if (password) updatedUser.password = password.trim();
    onChange(commitAppData({
      ...appData,
      users: appData.users.map((user) => user.id === currentUser.id ? updatedUser : user),
    }));
    setPassword("");
    setError("");
    setMessage("Your profile changes have been saved.");
  }

  return (
    <div className="profile-layout">
      <div className="page-heading"><div><p className="eyebrow">YOUR ACCOUNT</p><h1>Profile</h1></div></div>
      <section className="card profile-card">
        <div className="profile-summary"><span className="avatar avatar-profile">{getInitials(currentUser.name)}</span><div><h2>{currentUser.name}</h2><p className="muted">Your MiniSocial profile</p></div></div>
        <form className="form-stack profile-form" onSubmit={submit} noValidate>
          <label htmlFor="profile-name">Full name</label>
          <input id="profile-name" autoComplete="name" maxLength={80} value={name} onChange={(event) => setName(event.target.value)} required />
          <label htmlFor="profile-email">Email</label>
          <input id="profile-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="profile-password">New demo password <span className="label-hint">(leave blank to keep your current password)</span></label>
          <input id="profile-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
          <p className="demo-note">This teaching prototype stores passwords in browser storage. Do not use a real password.</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          {message && <p className="form-success" role="status">{message}</p>}
          <button type="submit" className="button">Save changes</button>
        </form>
      </section>
    </div>
  );
}
