import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function MyBookings() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const userId = sessionStorage.getItem("userId");
        
        if (!userId) {
            navigate("/login");
            return;
        }

        const fetchBookings = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/bookings/${userId}`
                );
                setBookings(response.data);
            } catch (err) {
                setError("Failed to load bookings");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [navigate]);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return;
        }

        try {
            await axios.put(
                `${process.env.REACT_APP_API_URL}/booking/${bookingId}/cancel`
            );
            setBookings(bookings.map(b => 
                b.id === bookingId ? { ...b, status: "Cancelled" } : b
            ));
        } catch (err) {
            alert("Failed to cancel booking");
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "40px", minHeight: "70vh", backgroundColor: "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "40px", marginBottom: "15px" }}>⏳</div>
                    <h2 style={{ color: "#666" }}>Loading your bookings...</h2>
                </div>
            </div>
        );
    }

    return (
        <div style={{ padding: "40px 20px", minHeight: "70vh", backgroundColor: "#f5f6fa" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                <h2 style={{ marginBottom: "30px", color: "#333" }}>My Bookings</h2>

                {error && (
                    <div style={{ 
                        padding: "15px", 
                        background: "#f8d7da", 
                        color: "#721c24", 
                        borderRadius: "8px", 
                        marginBottom: "20px" 
                    }}>
                        {error}
                    </div>
                )}

                {bookings.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                        <div style={{ fontSize: "70px", marginBottom: "20px" }}>🎫</div>
                        <h3 style={{ color: "#666", marginBottom: "10px" }}>No Bookings Yet</h3>
                        <p style={{ color: "#888", marginBottom: "25px" }}>
                            You haven't booked any tickets yet. Start planning your trip!
                        </p>
                        <button
                            onClick={() => navigate("/search")}
                            style={{
                                padding: "14px 30px",
                                backgroundColor: "#483f19",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "16px",
                                fontWeight: "500"
                            }}
                        >
                            🔍 Search Buses
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "grid", gap: "20px" }}>
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                style={{
                                    padding: "25px",
                                    borderRadius: "16px",
                                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                    background: "#fff",
                                    borderLeft: `6px solid ${booking.status === "Confirmed" ? "#28a745" : "#dc3545"}`
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "20px" }}>
                                    <div style={{ flex: "1 1 400px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px", flexWrap: "wrap" }}>
                                            <h3 style={{ margin: 0, fontSize: "22px", color: "#333" }}>{booking.busName}</h3>
                                            <span style={{
                                                padding: "6px 14px",
                                                borderRadius: "20px",
                                                fontSize: "13px",
                                                fontWeight: "500",
                                                background: booking.status === "Confirmed" ? "#d4edda" : "#f8d7da",
                                                color: booking.status === "Confirmed" ? "#155724" : "#721c24"
                                            }}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        
                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "15px" }}>
                                            <div>
                                                <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "13px" }}>ROUTE</p>
                                                <p style={{ margin: 0, fontWeight: "600", color: "#333" }}>{booking.from} → {booking.to}</p>
                                            </div>
                                            <div>
                                                <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "13px" }}>DATE & TIME</p>
                                                <p style={{ margin: 0, fontWeight: "600", color: "#333" }}>{booking.travelDate} • {booking.departureTime}</p>
                                            </div>
                                            <div>
                                                <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "13px" }}>SEATS</p>
                                                <p style={{ margin: 0, fontWeight: "600", color: "#333" }}>{booking.seats.map(s => s.seatNumber).join(", ")}</p>
                                            </div>
                                            <div>
                                                <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "13px" }}>PASSENGER</p>
                                                <p style={{ margin: 0, fontWeight: "600", color: "#333" }}>{booking.passengerName}</p>
                                            </div>
                                        </div>

                                        <p style={{ margin: "10px 0 0 0", color: "#888", fontSize: "13px" }}>
                                            Booking ID: #{booking.id} | Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div style={{ textAlign: "center", minWidth: "120px" }}>
                                        <div style={{ fontSize: "28px", fontWeight: "bold", color: "#28a745", marginBottom: "15px" }}>
                                            ${booking.totalPrice}
                                        </div>
                                        {booking.status === "Confirmed" && (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                style={{
                                                    padding: "10px 20px",
                                                    backgroundColor: "#dc3545",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    fontSize: "14px",
                                                    fontWeight: "500"
                                                }}
                                            >
                                                ❌ Cancel
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div style={{ marginTop: "30px", textAlign: "center" }}>
                    <button
                        onClick={() => navigate("/home")}
                        style={{
                            padding: "12px 25px",
                            backgroundColor: "white",
                            color: "#483f19",
                            borderRadius: "8px",
                            cursor: "pointer",
                            border: "2px solid #483f19",
                            fontSize: "15px",
                            fontWeight: "500"
                        }}
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}
