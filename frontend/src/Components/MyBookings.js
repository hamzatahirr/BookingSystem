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
                console.error("Error fetching bookings:", err);
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
            alert("Booking cancelled successfully");
        } catch (err) {
            console.error("Cancel error:", err);
            alert("Failed to cancel booking");
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h2>Loading your bookings...</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: "40px", minHeight: "70vh", backgroundColor: "#f5f6fa" }}>
            <h2 style={{ marginBottom: "30px" }}>My Bookings</h2>

            {error && (
                <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>
            )}

            {bookings.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px" }}>
                    <p style={{ fontSize: "18px", color: "#666", marginBottom: "20px" }}>
                        You haven't booked any tickets yet.
                    </p>
                    <button
                        onClick={() => navigate("/search")}
                        style={{
                            padding: "12px 25px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "15px"
                        }}
                    >
                        Book a Bus
                    </button>
                </div>
            ) : (
                <div style={{ display: "grid", gap: "20px", maxWidth: "900px" }}>
                    {bookings.map((booking) => (
                        <div
                            key={booking.id}
                            style={{
                                padding: "25px",
                                borderRadius: "12px",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                                background: "#fff",
                                borderLeft: `5px solid ${booking.status === "Confirmed" ? "#28a745" : "#dc3545"}`
                            }}
                        >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
                                        <h3 style={{ margin: 0 }}>{booking.busName}</h3>
                                        <span style={{
                                            padding: "4px 12px",
                                            borderRadius: "20px",
                                            fontSize: "12px",
                                            background: booking.status === "Confirmed" ? "#d4edda" : "#f8d7da",
                                            color: booking.status === "Confirmed" ? "#155724" : "#721c24"
                                        }}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    
                                    <p style={{ margin: "5px 0", color: "#666" }}>
                                        <strong>From:</strong> {booking.from} → <strong>To:</strong> {booking.to}
                                    </p>
                                    <p style={{ margin: "5px 0", color: "#666" }}>
                                        <strong>Time:</strong> {booking.departureTime} → {booking.arrivalTime}
                                    </p>
                                    <p style={{ margin: "5px 0", color: "#666" }}>
                                        <strong>Travel Date:</strong> {booking.travelDate}
                                    </p>
                                    <p style={{ margin: "5px 0", color: "#666" }}>
                                        <strong>Seats:</strong> {booking.seats.map(s => s.seatNumber).join(", ")}
                                    </p>
                                    <p style={{ margin: "5px 0", color: "#666" }}>
                                        <strong>Passenger:</strong> {booking.passengerName} | {booking.passengerPhone}
                                    </p>
                                    <p style={{ margin: "5px 0", color: "#888", fontSize: "14px" }}>
                                        <strong>Booked on:</strong> {new Date(booking.bookingDate).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: "24px", fontWeight: "bold", color: "#28a745", marginBottom: "15px" }}>
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
                                                borderRadius: "6px",
                                                cursor: "pointer",
                                                fontSize: "14px"
                                            }}
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div style={{ marginTop: "30px" }}>
                <button
                    onClick={() => navigate("/home")}
                    style={{
                        padding: "10px 20px",
                        backgroundColor: "transparent",
                        color: "#666",
                        borderRadius: "6px",
                        cursor: "pointer",
                        border: "1px solid #ddd"
                    }}
                >
                    ← Back to Home
                </button>
            </div>
        </div>
    );
}
