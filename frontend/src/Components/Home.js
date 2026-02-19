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

        // ✅ When backend is ready — just uncomment API
        const fetchUser = async () => {
            try {

                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/user/${email}`
                );

                setUserName(response.data.name);

            } catch (error) {

                // Temporary fallback (NO rewrite needed later)
                setUserName(email.split("@")[0]);

            }

            setLoading(false);
        };

        fetchUser();

    }, [navigate]);

    if (loading) {
        return <h2 style={{ padding: "40px" }}>Loading dashboard...</h2>;
    }

    return (
        <div style={{
            padding: "40px",
            minHeight: "70vh",
            backgroundColor: "#f5f6fa"
        }}>

            <h2 style={{ marginBottom: "30px" }}>
                Welcome, {userName} 👋
            </h2>

            {/* Dashboard Cards */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "20px"
            }}>

                <div
                    onClick={() => navigate("/search")}
                    style={cardStyle}
                >
                    <h3>Search Bus</h3>
                    <p>Find routes, timings and available buses.</p>
                </div>

                <div
                    onClick={() => navigate("/mybookings")}
                    style={cardStyle}
                >
                    <h3>My Bookings</h3>
                    <p>View and manage your booked tickets.</p>
                </div>

                <div
                    onClick={() => navigate("/help")}
                    style={cardStyle}
                >
                    <h3>Help Center</h3>
                    <p>Get support and guidance.</p>
                </div>

            </div>
        </div>
    );
}

const cardStyle = {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    cursor: "pointer",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
    transition: "0.3s"
};
