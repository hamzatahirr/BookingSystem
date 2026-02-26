import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();

    const buses = location.state?.buses || [];
    const searchData = location.state?.searchData || {};

    if (!Array.isArray(buses) || buses.length === 0) {
        return (
            <div style={{ padding: "40px", minHeight: "70vh", backgroundColor: "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center", background: "white", padding: "50px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                    <div style={{ fontSize: "60px", marginBottom: "20px" }}>🚌</div>
                    <h2 style={{ color: "#666", marginBottom: "10px" }}>No Buses Found</h2>
                    <p style={{ color: "#888", marginBottom: "25px" }}>Try searching with different cities or date</p>
                    <button
                        onClick={() => navigate("/search")}
                        style={{
                            padding: "14px 30px",
                            backgroundColor: "#483f19",
                            color: "#fff",
                            borderRadius: "8px",
                            cursor: "pointer",
                            border: "none",
                            fontSize: "16px",
                            fontWeight: "500"
                        }}
                    >
                        🔍 Search Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "40px 20px", minHeight: "70vh", backgroundColor: "#f5f6fa" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <div>
                        <h2 style={{ margin: "0 0 5px 0", color: "#333" }}>Available Buses</h2>
                        <p style={{ margin: 0, color: "#666" }}>
                            {searchData.from} → {searchData.to} | {searchData.date}
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/search")}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "white",
                            color: "#483f19",
                            borderRadius: "8px",
                            cursor: "pointer",
                            border: "2px solid #483f19",
                            fontSize: "14px",
                            fontWeight: "500"
                        }}
                    >
                        ← Modify Search
                    </button>
                </div>

                <div style={{ display: "grid", gap: "20px" }}>
                    {buses.map((bus, index) => (
                        <div
                            key={bus.id || index}
                            style={{
                                padding: "25px",
                                borderRadius: "16px",
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                background: "#fff",
                                border: "1px solid #eee",
                                transition: "transform 0.2s, box-shadow 0.2s"
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.12)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
                                <div style={{ flex: "1 1 300px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
                                        <span style={{ 
                                            background: "#483f19", 
                                            color: "white", 
                                            padding: "8px 15px", 
                                            borderRadius: "8px",
                                            fontWeight: "600",
                                            fontSize: "14px"
                                        }}>
                                            {bus.busType || "Standard"}
                                        </span>
                                        <h3 style={{ margin: 0, color: "#333", fontSize: "22px" }}>{bus.bus}</h3>
                                    </div>
                                    
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                                        <div>
                                            <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "13px" }}>FROM</p>
                                            <p style={{ margin: 0, fontWeight: "600", color: "#333" }}>{bus.from}</p>
                                            <p style={{ margin: "3px 0 0 0", color: "#666", fontSize: "15px" }}>{bus.time}</p>
                                        </div>
                                        <div>
                                            <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "13px" }}>TO</p>
                                            <p style={{ margin: 0, fontWeight: "600", color: "#333" }}>{bus.to}</p>
                                            <p style={{ margin: "3px 0 0 0", color: "#666", fontSize: "15px" }}>{bus.arrivalTime}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                                        <span style={{ color: "#666", fontSize: "14px" }}>
                                            🪑 {bus.availableSeats || "N/A"} seats available
                                        </span>
                                        {bus.amenities && bus.amenities.length > 0 && (
                                            <span style={{ color: "#888", fontSize: "13px" }}>
                                                ✨ {bus.amenities.slice(0, 3).join(", ")}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div style={{ textAlign: "center", minWidth: "150px" }}>
                                    <div style={{ fontSize: "32px", fontWeight: "bold", color: "#28a745", marginBottom: "5px" }}>
                                        {bus.price}
                                    </div>
                                    <div style={{ fontSize: "13px", color: "#888", marginBottom: "15px" }}>per person</div>
                                    <button
                                        onClick={() => navigate("/seats", { state: { bus: { ...bus, travelDate: searchData.date } } })}
                                        style={{
                                            padding: "14px 30px",
                                            backgroundColor: "#483f19",
                                            color: "#fff",
                                            borderRadius: "8px",
                                            cursor: "pointer",
                                            border: "none",
                                            fontSize: "16px",
                                            fontWeight: "600",
                                            transition: "background 0.3s"
                                        }}
                                    >
                                        🎫 Select Seats
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
