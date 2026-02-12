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

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/signup`, payload);

      console.log("Signup successful:", response.data);
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });

      setSuccess("Account created successfully!");

      // Redirect to login after signup
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error("Signup error:", err);
      setError("Failed to sign up. Try a different email.");
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
      <h1 style={{ fontWeight: "bold", color: "#483f19" }}>Sign Up</h1>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div style={{ marginBottom: "10px" }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

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

        <div style={{ marginBottom: "10px" }}>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
          />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

        <label>
          <input type="checkbox" required style={{ marginRight: "5px" }} />
          I agree to the terms and conditions
        </label>

        <button
          className="mt-3"
          type="submit"
          style={{
            width: "100%",
            padding: "10px 20px",
            backgroundColor: "#483f19",
            color: "#dacdbc",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Sign Up
        </button>
      </form>

      <p className="mt-4">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
    </div>
  );
}
