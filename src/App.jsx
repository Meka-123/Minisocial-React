import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Chats from "./pages/Chats.jsx";
import Feed from "./pages/Feed.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Friends from "./pages/Friends.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Signup from "./pages/Signup.jsx";
import { commitAppData, getAppData } from "./utils/storage.js";

export default function App() {
  const [appData, setAppData] = useState(getAppData);
  const currentUser = appData.users.find((user) => user.id === appData.currentUserId) ?? null;

  function updateAppData(nextData) {
    setAppData(commitAppData(nextData));
  }

  function logout() {
    const nextData = { ...appData, currentUserId: null };
    updateAppData(nextData);
  }

  return (
    <div className="app-shell">
      {currentUser && <Navbar currentUser={currentUser} onLogout={logout} />}
      <main className={currentUser ? "page-shell" : "auth-shell"}>
        <Routes>
          <Route path="/login" element={currentUser ? <Navigate to="/feed" replace /> : <Login appData={appData} onChange={updateAppData} />} />
          <Route path="/signup" element={currentUser ? <Navigate to="/feed" replace /> : <Signup appData={appData} onChange={updateAppData} />} />
          <Route path="/forgot-password" element={<ForgotPassword appData={appData} onChange={updateAppData} />} />
          <Route path="/" element={<Navigate to={currentUser ? "/feed" : "/login"} replace />} />
          <Route element={<ProtectedRoute isAuthenticated={Boolean(currentUser)} />}>
            <Route path="/feed" element={<Feed appData={appData} onChange={updateAppData} currentUser={currentUser} />} />
            <Route path="/chats" element={<Chats appData={appData} onChange={updateAppData} currentUser={currentUser} />} />
            <Route path="/friends" element={<Friends appData={appData} onChange={updateAppData} currentUser={currentUser} />} />
            <Route path="/profile" element={<Profile appData={appData} onChange={updateAppData} currentUser={currentUser} />} />
          </Route>
          <Route path="*" element={<Navigate to={currentUser ? "/feed" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}
