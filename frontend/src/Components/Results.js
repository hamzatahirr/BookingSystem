import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();

    const buses = location.state || [];

    return (
        <div style={{ padding: "40px", minHeight: "70vh" }}>
            <h2>Available Buses</h2>

            {buses.length === 0 ? (
                <p>No buses found. Try searching again.</p>
            ) : (
                <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
                    {buses.map((bus) => (
                        <div
                            key={bus.id}
                            style={{
                                padding: "20px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                                background: "#fff",
                            }}
                        >
                            <h3>{bus.bus}</h3>
                            <p><strong>From:</strong> {bus.from}</p>
                            <p><strong>To:</strong> {bus.to}</p>
                            <p><strong>Time:</strong> {bus.time}</p>

                            <button
                                onClick={() => navigate("/home")}
                                style={{
                                    marginTop: "10px",
                                    padding: "8px 15px",
                                    backgroundColor: "#483f19",
                                    color: "#fff",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                Back to Home
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
