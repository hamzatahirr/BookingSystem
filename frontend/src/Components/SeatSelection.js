import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SeatSelection() {
    const location = useLocation();
    const navigate = useNavigate();
    const busData = location.state?.bus;

    const [selectedSeats, setSelectedSeats] = useState([]);
    const [passengerName, setPassengerName] = useState("");
    const [passengerPhone, setPassengerPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!busData) {
        return (
            <div style={{ padding: "40px", minHeight: "70vh", backgroundColor: "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ color: "#666" }}>No bus selected</h2>
                    <p style={{ color: "#888", marginBottom: "20px" }}>Please select a bus first</p>
                    <button
                        onClick={() => navigate("/search")}
                        style={{
                            padding: "12px 25px",
                            backgroundColor: "#483f19",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "15px"
                        }}
                    >
                        🔍 Search Buses
                    </button>
                </div>
            </div>
        );
    }

    const totalSeats = busData.totalSeats || 40;
    const seatsPerRow = 4;
    const price = parseInt(busData.price.replace('$', '')) || 0;

    const seatNumber = [];
    for (let i = 1; i <= totalSeats; i++) {
        seatNumber.push(i);
    }

    const isSeatSelected = (seatNum) => {
        return selectedSeats.some(s => s.seatNumber === seatNum);
    };

    const isSeatBooked = (seatNum) => {
        return busData.availableSeats < seatNum;
    };

    const toggleSeat = (seatNum) => {
        if (isSeatBooked(seatNum)) {
            return;
        }

        if (isSeatSelected(seatNum)) {
            setSelectedSeats(selectedSeats.filter(s => s.seatNumber !== seatNum));
            setError("");
        } else {
            setSelectedSeats([...selectedSeats, { seatNumber: seatNum, seatPrice: price }]);
            setError("");
        }
    };

    const totalPrice = selectedSeats.length * price;

    const validateForm = () => {
        if (selectedSeats.length === 0) {
            setError("Please select at least one seat");
            return false;
        }
        if (!passengerName.trim()) {
            setError("Please enter passenger name");
            return false;
        }
        if (!passengerPhone.trim()) {
            setError("Please enter phone number");
            return false;
        }
        if (passengerPhone.length < 10) {
            setError("Please enter a valid phone number");
            return false;
        }
        return true;
    };

    const handleBooking = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError("");

        const userId = sessionStorage.getItem("userId");

        if (!userId) {
            navigate("/login");
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/booking`,
                {
                    busId: busData.id,
                    busName: busData.bus,
                    from: busData.from,
                    to: busData.to,
                    departureTime: busData.time,
                    arrivalTime: busData.arrivalTime,
                    seats: selectedSeats,
                    totalPrice: totalPrice,
                    travelDate: busData.travelDate,
                    passengerName: passengerName.trim(),
                    passengerPhone: passengerPhone.trim(),
                    userId
                }
            );

            navigate("/confirmation", { state: response.data });
        } catch (err) {
            setError("Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getSeatColor = (seatNum) => {
        if (isSeatSelected(seatNum)) return "#28a745";
        if (isSeatBooked(seatNum)) return "#dc3545";
        return "#483f19";
    };

    return (
        <div style={{ padding: "40px 20px", minHeight: "70vh", backgroundColor: "#f5f6fa" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <h2 style={{ marginBottom: "10px", color: "#333" }}>Select Your Seats</h2>
                <p style={{ marginBottom: "30px", color: "#666" }}>
                    {busData.bus} • {busData.from} → {busData.to} • {busData.travelDate}
                </p>

                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" }, 
                    gap: "30px" 
                }}>
                    <div style={{ background: "white", padding: "30px", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                        <div style={{ marginBottom: "25px", display: "flex", gap: "25px", justifyContent: "center", flexWrap: "wrap" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ width: "24px", height: "24px", background: "#483f19", borderRadius: "6px" }}></span>
                                <small style={{ color: "#666" }}>Available</small>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ width: "24px", height: "24px", background: "#28a745", borderRadius: "6px" }}></span>
                                <small style={{ color: "#666" }}>Selected</small>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ width: "24px", height: "24px", background: "#dc3545", borderRadius: "6px" }}></span>
                                <small style={{ color: "#666" }}>Booked</small>
                            </div>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", alignItems: "center" }}>
                            <div style={{ 
                                width: "100%", 
                                textAlign: "center", 
                                padding: "12px",
                                background: "#483f19",
                                color: "white",
                                borderRadius: "8px 8px 0 0",
                                fontWeight: "600"
                            }}>
                                🚌 BUS SEAT LAYOUT
                            </div>
                            
                            {Array.from({ length: Math.ceil(totalSeats / seatsPerRow) }, (_, rowIndex) => (
                                <div key={rowIndex} style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                    {seatNumber.slice(rowIndex * seatsPerRow, (rowIndex + 1) * seatsPerRow).map((seatNum) => (
                                        <button
                                            key={seatNum}
                                            onClick={() => toggleSeat(seatNum)}
                                            disabled={isSeatBooked(seatNum)}
                                            title={isSeatBooked(seatNum) ? "Already booked" : `Seat ${seatNum}`}
                                            style={{
                                                width: "55px",
                                                height: "55px",
                                                border: "none",
                                                borderRadius: "10px",
                                                background: getSeatColor(seatNum),
                                                color: "white",
                                                cursor: isSeatBooked(seatNum) ? "not-allowed" : "pointer",
                                                fontWeight: "bold",
                                                fontSize: "16px",
                                                opacity: isSeatBooked(seatNum) ? 0.5 : 1,
                                                transition: "transform 0.1s, background 0.2s"
                                            }}
                                        >
                                            {seatNum}
                                        </button>
                                    ))}
                                    {rowIndex % 2 === 0 && <div style={{ width: "40px" }}></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: "white", padding: "30px", borderRadius: "16px", height: "fit-content", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", position: "sticky", top: "20px" }}>
                        <h3 style={{ marginBottom: "20px", color: "#333", borderBottom: "2px solid #eee", paddingBottom: "15px" }}>Booking Summary</h3>
                        
                        <div style={{ marginBottom: "15px" }}>
                            <span style={{ color: "#888", fontSize: "14px" }}>Bus</span>
                            <p style={{ margin: "5px 0 0 0", fontWeight: "600", fontSize: "18px" }}>{busData.bus}</p>
                        </div>
                        
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "20px" }}>
                            <div>
                                <span style={{ color: "#888", fontSize: "14px" }}>From</span>
                                <p style={{ margin: "5px 0 0 0", fontWeight: "600" }}>{busData.from}</p>
                            </div>
                            <div>
                                <span style={{ color: "#888", fontSize: "14px" }}>To</span>
                                <p style={{ margin: "5px 0 0 0", fontWeight: "600" }}>{busData.to}</p>
                            </div>
                            <div>
                                <span style={{ color: "#888", fontSize: "14px" }}>Date</span>
                                <p style={{ margin: "5px 0 0 0", fontWeight: "600" }}>{busData.travelDate}</p>
                            </div>
                            <div>
                                <span style={{ color: "#888", fontSize: "14px" }}>Time</span>
                                <p style={{ margin: "5px 0 0 0", fontWeight: "600" }}>{busData.time}</p>
                            </div>
                        </div>
                        
                        <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "12px", marginBottom: "20px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <span style={{ color: "#666" }}>Selected Seats</span>
                                <span style={{ fontWeight: "bold", fontSize: "18px" }}>
                                    {selectedSeats.length > 0 ? selectedSeats.map(s => s.seatNumber).join(", ") : "None"}
                                </span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <span style={{ color: "#666" }}>Price per seat</span>
                                <span>${price}</span>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "10px", borderTop: "2px solid #ddd" }}>
                                <span style={{ fontWeight: "bold", fontSize: "18px" }}>Total</span>
                                <span style={{ fontWeight: "bold", fontSize: "28px", color: "#28a745" }}>${totalPrice}</span>
                            </div>
                        </div>

                        <div style={{ marginBottom: "20px" }}>
                            <h4 style={{ marginBottom: "15px", color: "#333" }}>Passenger Details</h4>
                            
                            <div style={{ marginBottom: "15px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#555" }}>Full Name *</label>
                                <input
                                    type="text"
                                    value={passengerName}
                                    onChange={(e) => { setPassengerName(e.target.value); setError(""); }}
                                    placeholder="Enter passenger name"
                                    style={{
                                        width: "100%",
                                        padding: "14px",
                                        borderRadius: "8px",
                                        border: "2px solid #ddd",
                                        fontSize: "16px",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>
                            
                            <div style={{ marginBottom: "10px" }}>
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#555" }}>Phone Number *</label>
                                <input
                                    type="tel"
                                    value={passengerPhone}
                                    onChange={(e) => { setPassengerPhone(e.target.value); setError(""); }}
                                    placeholder="Enter phone number"
                                    style={{
                                        width: "100%",
                                        padding: "14px",
                                        borderRadius: "8px",
                                        border: "2px solid #ddd",
                                        fontSize: "16px",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>
                        </div>

                        {error && (
                            <div style={{ 
                                padding: "12px", 
                                background: "#f8d7da", 
                                color: "#721c24", 
                                borderRadius: "8px", 
                                marginBottom: "15px",
                                textAlign: "center"
                            }}>
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleBooking}
                            disabled={loading || selectedSeats.length === 0}
                            style={{
                                width: "100%",
                                padding: "16px",
                                backgroundColor: loading ? "#ccc" : "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "18px",
                                fontWeight: "600",
                                cursor: loading ? "not-allowed" : "pointer",
                                marginBottom: "12px"
                            }}
                        >
                            {loading ? "⏳ Processing..." : "✅ Confirm Booking"}
                        </button>

                        <button
                            onClick={() => navigate("/results", { state: { buses: [busData], searchData: { date: busData.travelDate } } })}
                            style={{
                                width: "100%",
                                padding: "14px",
                                backgroundColor: "transparent",
                                color: "#666",
                                border: "2px solid #ddd",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontSize: "15px",
                                fontWeight: "500"
                            }}
                        >
                            ← Back to Results
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
