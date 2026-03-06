import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function LogIn() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return false;
    }
    if (!formData.password) {
      setError("Please enter your password");
      return false;
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email");
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

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        formData
      );

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      sessionStorage.setItem("email", formData.email);

      if (response.data?.user?.id) {
        sessionStorage.setItem("userId", response.data.user.id);
      }

      navigate("/home");

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
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
        <h1 style={{ fontWeight: "bold", color: "#483f19", textAlign: "center", marginBottom: "10px" }}>Welcome Back</h1>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "30px" }}>Log in to continue booking</p>

        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
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

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" }}>
            <label style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" style={{ marginRight: "8px" }} />
              <span style={{ color: "#666", fontSize: "14px" }}>Remember me</span>
            </label>
            <Link to="/forgetpass" style={{ color: "#483f19", fontSize: "14px", textDecoration: "none" }}>
              Forgot Password?
            </Link>
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
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "25px", color: "#666" }}>
          Don't have an account? <Link to="/signup" style={{ color: "#483f19", fontWeight: "600", textDecoration: "none" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
