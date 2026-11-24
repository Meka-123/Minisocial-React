import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getInitials } from "../utils/demoData.js";

const links = [
  { to: "/feed", label: "Feed" },
  { to: "/friends", label: "Friends" },
  { to: "/chats", label: "Chats" },
  { to: "/profile", label: "Profile" },
];

export default function Navbar({ currentUser, onLogout }) {
  const navigate = useNavigate();

  function handleLogout() {
    onLogout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="site-header">
      <div className="nav-inner">
        <NavLink className="brand" to="/feed" aria-label="MiniSocial home">mini<span>social</span></NavLink>
        <nav className="main-nav" aria-label="Main navigation">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="nav-account">
          <NavLink className="nav-profile" to="/profile">
            <span className="avatar avatar-small">{getInitials(currentUser.name)}</span>
            <span className="nav-name">{currentUser.name}</span>
          </NavLink>
          <button type="button" className="button button-quiet button-small" onClick={handleLogout}>Log out</button>
        </div>
      </div>
    </header>
  );
}
