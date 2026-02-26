import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingConfirmation() {
    const location = useLocation();
    const navigate = useNavigate();

    const bookingData = location.state?.booking;
    const message = location.state?.message;

    useEffect(() => {
        if (!bookingData) {
            const timer = setTimeout(() => {
                navigate("/home", { replace: true });
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [bookingData, navigate]);

    if (!bookingData) {
        return (
            <div style={{ padding: "40px", minHeight: "70vh", backgroundColor: "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ color: "#666" }}>No booking found</h2>
                    <p style={{ color: "#888" }}>Redirecting to home...</p>
                    <button
                        onClick={() => navigate("/home")}
                        style={{
                            marginTop: "20px",
                            padding: "12px 25px",
                            backgroundColor: "#483f19",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "15px"
                        }}
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    const bookingId = bookingData.id;
    const seats = bookingData.seats || [];
    const seatNumbers = seats.map(s => s.seatNumber).join(", ");

    const handleDownloadTicket = () => {
        const ticketContent = `
=================================
     ART CRAFT BUS TICKET
=================================

BOOKING ID: #${bookingId}

PASSENGER: ${bookingData.passengerName}
PHONE: ${bookingData.passengerPhone}

---------------------------------
TRIP DETAILS
---------------------------------
BUS: ${bookingData.busName}
FROM: ${bookingData.from}
TO: ${bookingData.to}
DATE: ${bookingData.travelDate}
DEPARTURE: ${bookingData.departureTime}

---------------------------------
SEAT INFO
---------------------------------
SEATS: ${seatNumbers}
TOTAL PAID: $${bookingData.totalPrice}

---------------------------------
BOOKING DATE: ${new Date(bookingData.bookingDate).toLocaleDateString()}

Thank you for booking with ArtCraft!
=================================
        `;

        const blob = new Blob([ticketContent], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Ticket-${bookingId}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ padding: "40px", minHeight: "70vh", backgroundColor: "#f5f6fa" }}>
            <div style={{ maxWidth: "700px", margin: "0 auto" }}>
                <div style={{ 
                    background: "white", 
                    borderRadius: "16px",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                    overflow: "hidden"
                }}>
                    <div style={{ 
                        background: "linear-gradient(135deg, #483f19 0%, #6b5d2e 100%)", 
                        padding: "30px", 
                        textAlign: "center",
                        color: "white"
                    }}>
                        <div style={{ 
                            width: "70px", 
                            height: "70px", 
                            background: "#28a745", 
                            borderRadius: "50%", 
                            margin: "0 auto 15px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "4px solid white"
                        }}>
                            <span style={{ color: "white", fontSize: "35px", fontWeight: "bold" }}>✓</span>
                        </div>
                        <h2 style={{ margin: "0 0 5px 0", fontSize: "28px" }}>Booking Confirmed!</h2>
                        <p style={{ margin: 0, opacity: 0.9 }}>{message || "Your ticket has been booked successfully"}</p>
                    </div>

                    <div style={{ padding: "30px" }}>
                        <div style={{ 
                            background: "#f8f9fa", 
                            padding: "25px", 
                            borderRadius: "12px",
                            border: "2px dashed #ddd",
                            marginBottom: "25px"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                                <div>
                                    <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>BOOKING ID</p>
                                    <p style={{ margin: "5px 0 0 0", fontSize: "24px", fontWeight: "bold", color: "#483f19" }}>#{bookingId}</p>
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>BOOKING DATE</p>
                                    <p style={{ margin: "5px 0 0 0", fontSize: "16px", fontWeight: "500" }}>{new Date(bookingData.bookingDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                                <div>
                                    <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "13px" }}>PASSENGER NAME</p>
                                    <p style={{ margin: 0, fontWeight: "600", fontSize: "16px" }}>{bookingData.passengerName}</p>
                                </div>
                                <div>
                                    <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "13px" }}>PHONE</p>
                                    <p style={{ margin: 0, fontWeight: "600", fontSize: "16px" }}>{bookingData.passengerPhone}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ 
                            background: "#fff3cd", 
                            padding: "20px", 
                            borderRadius: "12px",
                            marginBottom: "25px",
                            borderLeft: "4px solid #ffc107"
                        }}>
                            <h3 style={{ margin: "0 0 15px 0", color: "#333", fontSize: "18px" }}>Trip Details</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                <div>
                                    <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "13px" }}>BUS NAME</p>
                                    <p style={{ margin: 0, fontWeight: "600", fontSize: "16px" }}>{bookingData.busName}</p>
                                </div>
                                <div>
                                    <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "13px" }}>ROUTE</p>
                                    <p style={{ margin: 0, fontWeight: "600", fontSize: "16px" }}>{bookingData.from} → {bookingData.to}</p>
                                </div>
                                <div>
                                    <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "13px" }}>TRAVEL DATE</p>
                                    <p style={{ margin: 0, fontWeight: "600", fontSize: "16px" }}>{bookingData.travelDate}</p>
                                </div>
                                <div>
                                    <p style={{ margin: "0 0 5px 0", color: "#888", fontSize: "13px" }}>DEPARTURE TIME</p>
                                    <p style={{ margin: 0, fontWeight: "600", fontSize: "16px" }}>{bookingData.departureTime}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ 
                            background: "#d4edda", 
                            padding: "20px", 
                            borderRadius: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "25px"
                        }}>
                            <div>
                                <p style={{ margin: "0 0 5px 0", color: "#155724", fontSize: "14px" }}>SELECTED SEATS</p>
                                <p style={{ margin: 0, fontSize: "28px", fontWeight: "bold", color: "#155724" }}>{seatNumbers}</p>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <p style={{ margin: "0 0 5px 0", color: "#155724", fontSize: "14px" }}>TOTAL PAID</p>
                                <p style={{ margin: 0, fontSize: "32px", fontWeight: "bold", color: "#155724" }}>${bookingData.totalPrice}</p>
                            </div>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px" }}>
                            <button
                                onClick={handleDownloadTicket}
                                style={{
                                    padding: "14px 20px",
                                    backgroundColor: "#17a2b8",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    transition: "background 0.3s"
                                }}
                            >
                                📥 Download Ticket
                            </button>
                            <button
                                onClick={() => navigate("/mybookings")}
                                style={{
                                    padding: "14px 20px",
                                    backgroundColor: "#483f19",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    transition: "background 0.3s"
                                }}
                            >
                                📋 My Bookings
                            </button>
                            <button
                                onClick={() => navigate("/search")}
                                style={{
                                    padding: "14px 20px",
                                    backgroundColor: "#28a745",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontSize: "15px",
                                    fontWeight: "500",
                                    transition: "background 0.3s"
                                }}
                            >
                                🎫 Book Another
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
