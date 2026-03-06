import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return false;
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email");
      return false;
    }
    if (!formData.password) {
      setError("Please enter a password");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/signup`, payload);

      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to sign up. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #f5f6fa 0%, #e9e4d4 100%)",
      padding: "20px"
    }}>
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "40px",
          backgroundColor: "#fff",
          borderRadius: "16px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ fontWeight: "bold", color: "#483f19", textAlign: "center", marginBottom: "10px" }}>Create Account</h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>Sign up to start booking</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#333" }}>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              style={{ 
                width: "100%", 
                padding: "14px", 
                borderRadius: "8px", 
                border: "2px solid #ddd",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#333" }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              style={{ 
                width: "100%", 
                padding: "14px", 
                borderRadius: "8px", 
                border: "2px solid #ddd",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#333" }}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              style={{ 
                width: "100%", 
                padding: "14px", 
                borderRadius: "8px", 
                border: "2px solid #ddd",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#333" }}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              style={{ 
                width: "100%", 
                padding: "14px", 
                borderRadius: "8px", 
                border: "2px solid #ddd",
                fontSize: "16px",
                boxSizing: "border-box"
              }}
            />
          </div>

          {error && (
            <div style={{ 
              padding: "12px", 
              background: "#f8d7da", 
              color: "#721c24", 
              borderRadius: "8px", 
              marginBottom: "20px",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ 
              padding: "12px", 
              background: "#d4edda", 
              color: "#155724", 
              borderRadius: "8px", 
              marginBottom: "20px",
              textAlign: "center"
            }}>
              {success}
            </div>
          )}

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" required style={{ marginRight: "10px" }} />
              <span style={{ color: "#666", fontSize: "14px" }}>I agree to the terms and conditions</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: loading ? "#888" : "#483f19",
              color: "#fff",
              borderRadius: "10px",
              border: "none",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.3s"
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "25px", color: "#666" }}>
          Already have an account? <Link to="/login" style={{ color: "#483f19", fontWeight: "600", textDecoration: "none" }}>Log In</Link>
        </p>
      </div>
    </div>
  );
}
