import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo_icon from "../Assets/logo.png";

export default function Navbar({ title }) {

  const location = useLocation();
  const navigate = useNavigate();

  const hideNavbarRoutes = ["/login", "/signup"];

  // ✅ Protect routes
  useEffect(() => {
    const email = sessionStorage.getItem("email");

    if (!email && !hideNavbarRoutes.includes(location.pathname)) {
      navigate("/login");
    }
  }, [location, navigate]);

  if (hideNavbarRoutes.includes(location.pathname)) return null;

  const handleSignOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 30px",
        backgroundColor: "#483f19",
        color: "#fff",
      }}
    >

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src={logo_icon} alt="logo" width="40" />
        <h2>{title}</h2>
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "20px" }}>

        <Link to="/home" style={linkStyle}>Home</Link>
        <Link to="/search" style={linkStyle}>Search Buses</Link>
        <Link to="/help" style={linkStyle}>Help</Link>

        <span
          onClick={handleSignOut}
          style={{ ...linkStyle, cursor: "pointer" }}
        >
          Logout
        </span>

      </div>
    </nav>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  fontWeight: "500"
};
