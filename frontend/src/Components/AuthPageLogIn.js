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
        formData
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
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{
        width: "400px",
        padding: "25px",
        backgroundColor: "#dacdbc",
        border: "1px solid #483f19",
        borderRadius: "10px",
      }}
    >
      <h1 style={{ fontWeight: "bold", color: "#483f19" }}>Log In</h1>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        {error && (
          <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
        )}

        <div className="log d-flex justify-content-between">
          <label>
            <input type="checkbox" style={{ marginRight: "5px" }} />
            Remember me
          </label>

          <Link to="/forgetpass">Forgot Password?</Link>
        </div>

        <button
          className="mt-3"
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px 20px",
            backgroundColor: loading ? "#888" : "#483f19",
            color: "#dacdbc",
            borderRadius: "10px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p className="mt-4">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}
