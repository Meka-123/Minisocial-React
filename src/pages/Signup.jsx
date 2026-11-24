import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { commitAppData, createId, normalizeEmail } from "../utils/storage.js";

export default function Signup({ appData, onChange }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function submit(event) {
    event.preventDefault();
    const cleanName = name.trim();
    const normalizedEmail = normalizeEmail(email);
    const cleanPassword = password.trim();
    if (!cleanName || !normalizedEmail || !cleanPassword) {
      setError("Complete each field before continuing.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (cleanPassword.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }
    if (appData.users.some((user) => user.email === normalizedEmail)) {
      setError("An account already uses that email. Try logging in.");
      return;
    }
    const user = { id: createId(), name: cleanName, email: normalizedEmail, password: cleanPassword };
    onChange(commitAppData({ ...appData, users: [...appData.users, user], currentUserId: user.id }));
    navigate("/feed", { replace: true });
  }

  return (
    <AuthLayout title="Join MiniSocial" description="Create an account to find your people.">
      <form className="form-stack" onSubmit={submit} noValidate>
        <label htmlFor="signup-name">Full name</label>
        <input id="signup-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} maxLength={80} required />
        <label htmlFor="signup-email">Email</label>
        <input id="signup-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <label htmlFor="signup-password">Password <span className="label-hint">(at least 8 characters)</span></label>
        <input id="signup-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="button button-full">Create account</button>
      </form>
      <p className="auth-footer">Already have an account? <Link to="/login">Log in</Link></p>
    </AuthLayout>
  );
}
