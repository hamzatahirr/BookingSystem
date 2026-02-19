import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();

    const bookingData = location.state?.booking;
    const message = location.state?.message;

    if (!bookingData) {
        return (
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h2>No booking found</h2>
                <button onClick={() => navigate("/search")}>Search Buses</button>
            </div>
        );
    }

    const bookingId = bookingData.id;
    const seats = bookingData.seats || [];
    const seatNumbers = seats.map(s => s.seatNumber).join(", ");

    return (
        <div style={{ padding: "40px", minHeight: "70vh", backgroundColor: "#f5f6fa" }}>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                <div style={{ 
                    background: "white", 
                    padding: "40px", 
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    textAlign: "center"
                }}>
                    <div style={{ 
                        width: "80px", 
                        height: "80px", 
                        background: "#28a745", 
                        borderRadius: "50%", 
                        margin: "0 auto 20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <span style={{ color: "white", fontSize: "40px" }}>✓</span>
                    </div>

                    <h2 style={{ color: "#28a745", marginBottom: "10px" }}>Booking Confirmed!</h2>
                    <p style={{ color: "#666", marginBottom: "30px" }}>{message || "Your ticket has been booked successfully"}</p>

                    <div style={{ 
                        background: "#f8f9fa", 
                        padding: "20px", 
                        borderRadius: "8px",
                        textAlign: "left",
                        marginBottom: "20px"
                    }}>
                        <h3 style={{ marginBottom: "15px", borderBottom: "2px solid #ddd", paddingBottom: "10px" }}>
                            Booking Details
                        </h3>
                        
                        <div style={{ marginBottom: "10px" }}>
                            <strong>Booking ID:</strong> #{bookingId}
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <strong>Bus Name:</strong> {bookingData.busName}
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <strong>From:</strong> {bookingData.from} → <strong>To:</strong> {bookingData.to}
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <strong>Departure Time:</strong> {bookingData.departureTime}
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <strong>Travel Date:</strong> {bookingData.travelDate}
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <strong>Seats:</strong> {seatNumbers}
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <strong>Passenger:</strong> {bookingData.passengerName}
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                            <strong>Booking Date:</strong> {new Date(bookingData.bookingDate).toLocaleDateString()}
                        </div>
                        <div style={{ 
                            marginTop: "15px", 
                            paddingTop: "15px", 
                            borderTop: "2px solid #ddd",
                            fontSize: "20px",
                            fontWeight: "bold"
                        }}>
                            Total Paid: ${bookingData.totalPrice}
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                        <button
                            onClick={() => navigate("/home")}
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
                            Go to Home
                        </button>
                        <button
                            onClick={() => navigate("/mybookings")}
                            style={{
                                padding: "12px 25px",
                                backgroundColor: "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "6px",
                                cursor: "pointer",
                                fontSize: "15px"
                            }}
                        >
                            View My Bookings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
