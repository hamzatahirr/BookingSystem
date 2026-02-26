import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, payload);

      setFormData({ name: "", email: "", password: "", confirmPassword: "" });

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setError("Failed to sign up. Try a different email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f6fa",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "35%",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #483f19 0%, #6b5d2e 100%)",
            padding: "20px",
            textAlign: "center",

          }}
        >
          <h1 style={{ fontWeight: "bold", color: "#fff", margin: 0 }}>
            Create Account
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: "10px 0 0 0" }}>
            Sign up to get started
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{  padding: "30px" }}
        >
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#333",
                fontWeight: "500",
              }}
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 15px",
                marginTop: "5px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "14px",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#333",
                fontWeight: "500",
              }}
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 15px",
                marginTop: "5px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "14px",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#333",
                fontWeight: "500",
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 15px",
                marginTop: "5px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "14px",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#333",
                fontWeight: "500",
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "12px 15px",
                marginTop: "5px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                fontSize: "14px",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
            />
          </div>

          {error && (
            <p
              style={{
                color: "#dc3545",
                fontSize: "14px",
                marginBottom: "15px",
                padding: "10px",
                backgroundColor: "#f8d7da",
                borderRadius: "8px",
              }}
            >
              {error}
            </p>
          )}

          {success && (
            <p
              style={{
                color: "#28a745",
                fontSize: "14px",
                marginBottom: "15px",
                padding: "10px",
                backgroundColor: "#d4edda",
                borderRadius: "8px",
              }}
            >
              {success}
            </p>
          )}

          <label
            style={{
              display: "flex",
              alignItems: "center",
              color: "#666",
              fontSize: "14px",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            <input type="checkbox" required style={{ marginRight: "8px" }} />
            I agree to the terms and conditions
          </label>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 20px",
              backgroundColor: loading ? "#888" : "#483f19",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <p style={{ marginTop: "25px", textAlign: "center", color: "#666" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#483f19",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
