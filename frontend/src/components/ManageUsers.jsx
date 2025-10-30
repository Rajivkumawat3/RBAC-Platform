import React, { useEffect, useState } from "react";
import API from "../api";
import "../styles/users.css";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [customRole, setCustomRole] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await API.get("/admin/users", { withCredentials: true });
        setUsers(res.data);

        const uniqueRoles = [...new Set(res.data.map((u) => u.role))];
        setRoles(uniqueRoles);
      } catch (err) {
        console.error("❌ Failed to fetch users:", err);
        alert("Failed to load users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
  };

  const handleSave = async (user) => {
    const finalRole =
      user.role === "Custom" && customRole[user.id]
        ? customRole[user.id].trim()
        : user.role;

    if (user.role === "Custom" && !customRole[user.id]) {
      alert("Please enter a custom role name before saving.");
      return;
    }

    try {
      await API.put(`/admin/users/${user.id}`, { role: finalRole }, { withCredentials: true });
      alert(`✅ Updated ${user.name}'s role to ${finalRole}`);
    } catch (err) {
      console.error("❌ Failed to update role:", err);
      alert("Failed to update user role");
    }
  };

  return (
    <div className="users-container">
      <h3>👥 Manage Users</h3>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Current Role</th>
              <th>Change Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>

                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                    <option value="Custom">Custom</option>
                  </select>

                  {user.role === "Custom" && (
                    <input
                      type="text"
                      placeholder="Enter custom role"
                      value={customRole[user.id] || ""}
                      onChange={(e) =>
                        setCustomRole({
                          ...customRole,
                          [user.id]: e.target.value,
                        })
                      }
                    />
                  )}
                </td>

                <td>
                  <button className="save-btn" onClick={() => handleSave(user)}>
                    💾 Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
