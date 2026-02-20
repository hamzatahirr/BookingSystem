import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
    const location = useLocation();
    const navigate = useNavigate();

    const buses = location.state?.buses || [];
    const searchData = location.state?.searchData || {};
    console.log(buses.length);

    return (
        <div style={{ padding: "40px", minHeight: "70vh", backgroundColor: "#f5f6fa" }}>
            <h2 style={{ marginBottom: "20px" }}>Available Buses</h2>

            {buses.length === 0 || !Array.isArray(buses) ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                    <p>No buses found. Try searching again.</p>
                    <button
                        onClick={() => navigate("/search")}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#483f19",
                            color: "#fff",
                            borderRadius: "6px",
                            cursor: "pointer",
                            border: "none",
                            marginTop: "10px"
                        }}
                    >
                        Search Buses
                    </button>
                </div>
            ) : (
                <div style={{ display: "grid", gap: "20px", marginTop: "20px", maxWidth: "900px" }}>
                    {buses.map((bus) => (
                        <div
                            key={bus.id}
                            style={{
                                padding: "25px",
                                borderRadius: "12px",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                background: "#fff",
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{bus.bus}</h3>
                                    <p style={{ margin: "5px 0", color: "#666" }}>
                                        <strong>From:</strong> {bus.from} → <strong>To:</strong> {bus.to}
                                    </p>
                                    <p style={{ margin: "5px 0", color: "#666" }}>
                                        <strong>Departure:</strong> {bus.time} | <strong>Arrival:</strong> {bus.arrivalTime}
                                    </p>
                                    <p style={{ margin: "5px 0", color: "#666" }}>
                                        <strong>Bus Type:</strong> {bus.busType || "Standard"} | 
                                        <strong> Available Seats:</strong> {bus.availableSeats || "N/A"}
                                    </p>
                                    {bus.amenities && bus.amenities.length > 0 && (
                                        <p style={{ margin: "5px 0", color: "#888", fontSize: "14px" }}>
                                            <strong>Amenities:</strong> {bus.amenities.join(", ")}
                                        </p>
                                    )}
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#28a745", marginBottom: "10px" }}>
                                        {bus.price}
                                    </div>
                                    <div style={{ fontSize: "14px", color: "#888", marginBottom: "15px" }}>per person</div>
                                    <button
                                        onClick={() => navigate("/seats", { state: { bus: { ...bus, travelDate: searchData.date } } })}
                                        style={{
                                            padding: "12px 25px",
                                            backgroundColor: "#007bff",
                                            color: "#fff",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            border: "none",
                                            fontSize: "15px",
                                            fontWeight: "500"
                                        }}
                                    >
                                        Select Seats
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: "30px" }}>
                <button
                    onClick={() => navigate("/search")}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "transparent",
                        color: "#666",
                        borderRadius: "6px",
                        cursor: "pointer",
                        border: "1px solid #ddd"
                    }}
                >
                    ← Back to Search
                </button>
            </div>
        </div>
    );
}
