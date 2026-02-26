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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        formData,
      );

      // Save token
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Save email for session
      sessionStorage.setItem("email", formData.email);

      // Save userId for booking
      if (response.data?.user?.id) {
        sessionStorage.setItem("userId", response.data.user.id);
      }

      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
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
            Welcome Back
          </h1>
          <p style={{ color: "rgba(255,255,255,0.8)", margin: "10px 0 0 0" }}>
            Log in to continue your journey
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

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                color: "#666",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <input type="checkbox" style={{ marginRight: "8px" }} />
              Remember me
            </label>

            <Link
              to="/forgetpass"
              style={{
                color: "#483f19",
                fontSize: "14px",
                textDecoration: "none",
              }}
            >
              Forgot Password?
            </Link>
          </div>

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
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p style={{ marginTop: "25px", textAlign: "center", color: "#666" }}>
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "#483f19",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
