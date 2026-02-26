import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Home() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const email = sessionStorage.getItem("email");

        if (!email) {
            navigate("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/user/${email}`
                );
                setUserName(response.data.name);
            } catch (error) {
                setUserName(email.split("@")[0]);
            }
            setLoading(false);
        };

        fetchUser();
    }, [navigate]);

    if (loading) {
        return (
            <div style={{ padding: "40px", minHeight: "70vh", backgroundColor: "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "40px", marginBottom: "15px" }}>⏳</div>
                    <h2 style={{ color: "#666" }}>Loading...</h2>
                </div>
            </div>
        );
    }

    const cardStyle = {
        background: "white",
        padding: "30px",
        borderRadius: "16px",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.2s, box-shadow 0.2s",
        textAlign: "center"
    };

    const handleCardHover = (e, isHovering) => {
        e.currentTarget.style.transform = isHovering ? "translateY(-5px)" : "translateY(0)";
        e.currentTarget.style.boxShadow = isHovering ? "0 8px 30px rgba(0,0,0,0.12)" : "0 4px 20px rgba(0,0,0,0.08)";
    };

    return (
        <div style={{
            padding: "40px 20px",
            minHeight: "70vh",
            backgroundColor: "#f5f6fa"
        }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                <div style={{ 
                    background: "linear-gradient(135deg, #483f19 0%, #6b5d2e 100%)", 
                    padding: "40px", 
                    borderRadius: "20px", 
                    color: "white",
                    marginBottom: "40px"
                }}>
                    <h2 style={{ margin: "0 0 10px 0", fontSize: "32px" }}>
                        Welcome back, {userName}! 👋
                    </h2>
                    <p style={{ margin: 0, opacity: 0.9, fontSize: "18px" }}>
                        Ready for your next journey?
                    </p>
                </div>

                <h3 style={{ marginBottom: "25px", color: "#333" }}>What would you like to do?</h3>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "25px"
                }}>
                    <div
                        onClick={() => navigate("/search")}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                        style={cardStyle}
                    >
                        <div style={{ fontSize: "50px", marginBottom: "15px" }}>🔍</div>
                        <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>Search Buses</h3>
                        <p style={{ margin: 0, color: "#666" }}>Find routes, timings and available buses for your trip.</p>
                    </div>

                    <div
                        onClick={() => navigate("/mybookings")}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                        style={cardStyle}
                    >
                        <div style={{ fontSize: "50px", marginBottom: "15px" }}>🎫</div>
                        <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>My Bookings</h3>
                        <p style={{ margin: 0, color: "#666" }}>View and manage your booked tickets.</p>
                    </div>

                    <div
                        onClick={() => navigate("/help")}
                        onMouseEnter={(e) => handleCardHover(e, true)}
                        onMouseLeave={(e) => handleCardHover(e, false)}
                        style={cardStyle}
                    >
                        <div style={{ fontSize: "50px", marginBottom: "15px" }}>❓</div>
                        <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>Help Center</h3>
                        <p style={{ margin: 0, color: "#666" }}>Get support and guidance for any issues.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
