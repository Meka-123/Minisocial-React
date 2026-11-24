import React, { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { commitAppData, normalizeEmail } from "../utils/storage.js";

export default function ForgotPassword({ appData, onChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    const normalizedEmail = normalizeEmail(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      setMessage("");
      return;
    }
    if (password.trim().length < 8) {
      setError("Choose a password with at least 8 characters.");
      setMessage("");
      return;
    }
    const user = appData.users.find((item) => item.email === normalizedEmail);
    if (!user) {
      setError("No account was found for that email in this browser.");
      setMessage("");
      return;
    }
    onChange(commitAppData({
      ...appData,
      users: appData.users.map((item) => item.id === user.id ? { ...item, password: password.trim() } : item),
    }));
    setError("");
    setMessage("Your demo password was reset. You can now log in with the new password.");
    setPassword("");
  }

  return (
    <AuthLayout title="Reset your password" description="Set a new password for an account saved in this browser.">
      <form className="form-stack" onSubmit={submit} noValidate>
        <label htmlFor="reset-email">Account email</label>
        <input id="reset-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <label htmlFor="reset-password">New password <span className="label-hint">(at least 8 characters)</span></label>
        <input id="reset-password" type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="form-success" role="status">{message}</p>}
        <button type="submit" className="button button-full">Reset password</button>
      </form>
      <p className="auth-footer"><Link to="/login">Back to log in</Link></p>
    </AuthLayout>
  );
}
