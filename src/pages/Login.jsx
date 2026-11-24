import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout.jsx";
import { commitAppData, normalizeEmail } from "../utils/storage.js";

export default function Login({ appData, onChange }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  function submit(event) {
    event.preventDefault();
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !password) {
      setError("Enter your email and password.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    const user = appData.users.find((item) => item.email === normalizedEmail && item.password === password.trim());
    if (!user) {
      setError("We couldn't find an account with those details.");
      return;
    }
    onChange(commitAppData({ ...appData, currentUserId: user.id }));
    navigate(location.state?.from || "/feed", { replace: true });
  }

  return (
    <AuthLayout title="Welcome back" description="Log in to continue to MiniSocial.">
      <form className="form-stack" onSubmit={submit} noValidate>
        <label htmlFor="login-email">Email</label>
        <input id="login-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        <label htmlFor="login-password">Password</label>
        <input id="login-password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button type="submit" className="button button-full">Log in</button>
      </form>
      <div className="auth-links"><Link to="/forgot-password">Forgot password?</Link><span>New here? <Link to="/signup">Create account</Link></span></div>
    </AuthLayout>
  );
}
