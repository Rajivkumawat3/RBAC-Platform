import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/login", form);
      alert("✅ Login successful!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" placeholder="Email" type="email" required onChange={handleChange} />
        <input name="password" placeholder="Password" type="password" required onChange={handleChange} />
        <button type="submit">Login</button>
        <p>
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}
