import React from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({ title, description, children }) {
  return (
    <section className="auth-card card">
      <Link to="/login" className="brand auth-brand">mini<span>social</span></Link>
      <h1>{title}</h1>
      <p className="auth-description">{description}</p>
      {children}
      <p className="demo-note">Teaching prototype only. Account data stays in this browser.</p>
    </section>
  );
}
