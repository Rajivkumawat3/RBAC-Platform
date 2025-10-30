import React from "react";
import "../styles/dashboard.css";

export default function Sidebar({ user, onNavigate, activePage }) {
  return (
    <div className="sidebar">
      <h2>Dashboard</h2>
      <p className="sidebar-user">👤 {user?.name}</p>

      <button
        className={activePage === "view-schemas" ? "active" : ""}
        onClick={() => onNavigate("view-schemas")}
      >
        📂 View Schemas
      </button>
      
      {user?.role === "Admin" && (
        <>
          <button
            className={activePage === "create-schema" ? "active" : ""}
            onClick={() => onNavigate("create-schema")}
          >
            ⚙️ Create Schema
          </button>

          <button
            className={activePage === "manage-users" ? "active" : ""}
            onClick={() => onNavigate("manage-users")}
          >
            👥 Manage Users
          </button>
        </>
      )}

      <button
        onClick={() => {
          document.cookie =
            "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          window.location.href = "/login";
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
}
