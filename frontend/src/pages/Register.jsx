import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Viewer",
    customRole: "",
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roleToSend = form.role === "Custom" ? form.customRole.trim() : form.role;

    if (form.role === "Custom" && !form.customRole.trim()) {
      alert("Please enter your custom role name");
      return;
    }

    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: roleToSend, 
      });

      alert("✅ Registered successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          required
          onChange={handleChange}
          value={form.name}
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          required
          onChange={handleChange}
          value={form.email}
        />
        <input
          name="password"
          placeholder="Password"
          type="password"
          required
          onChange={handleChange}
          value={form.password}
        />

        <select name="role" value={form.role} onChange={handleChange}>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Viewer">Viewer</option>
          <option value="Custom">Custom</option>
        </select>

        {form.role === "Custom" && (
          <input
            name="customRole"
            placeholder="Enter your custom role (e.g. Teacher)"
            value={form.customRole}
            onChange={handleChange}
          />
        )}

        <button type="submit">Register</button>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
