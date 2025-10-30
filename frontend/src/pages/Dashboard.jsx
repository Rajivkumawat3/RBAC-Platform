import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import CreateSchemaForm from "../components/CreateSchemaForm";
import SchemaList from "../components/SchemaList";
import ManageUsers from "../components/ManageUsers";
import API from "../api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("view-schemas");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/auth/me", { withCredentials: true });
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        window.location.href = "/login";
      }
    };
    fetchUser();
  }, []);

  if (!user) return <div className="loading">Loading Dashboard...</div>;

  const renderContent = () => {
    switch (activePage) {
      case "view-schemas":
        return <SchemaList userRole={user.role} />;
      case "create-schema":
        return user.role === "Admin" ? (
          <CreateSchemaForm />
        ) : (
          <p className="no-access">❌ Only Admins can create schemas.</p>
        );
      case "manage-users":
        return user.role === "Admin" ? (
          <ManageUsers />
        ) : (
          <p className="no-access">❌ Only Admins can manage users.</p>
        );
      default:
        return <p>Select a menu item from the sidebar.</p>;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar user={user} onNavigate={setActivePage} activePage={activePage} />
      <div className="dashboard-content">
        <h2>Welcome, {user.name}</h2>
        <p className="role-tag">Role: {user.role}</p>
        <div className="page-content">{renderContent()}</div>
      </div>
    </div>
  );
}
