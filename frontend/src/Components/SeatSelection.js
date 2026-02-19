import React, { useState, useEffect } from "react";
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
            <div style={{ padding: "40px", textAlign: "center" }}>
                <h2>No bus selected</h2>
                <button onClick={() => navigate("/search")}>Search Buses</button>
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

    const isSeatAvailable = (seatNum) => {
        return busData.availableSeats > seatNum - 1 || selectedSeats.length < busData.availableSeats;
    };

    const toggleSeat = (seatNum) => {
        if (!isSeatAvailable(seatNum)) {
            return;
        }

        if (isSeatSelected(seatNum)) {
            setSelectedSeats(selectedSeats.filter(s => s.seatNumber !== seatNum));
        } else {
            setSelectedSeats([...selectedSeats, { seatNumber: seatNum, seatPrice: price }]);
        }
    };

    const totalPrice = selectedSeats.length * price;

    const handleBooking = async () => {
        if (selectedSeats.length === 0) {
            setError("Please select at least one seat");
            return;
        }
        if (!passengerName || !passengerPhone) {
            setError("Please fill in passenger details");
            return;
        }

        setLoading(true);
        setError("");

        const userId = sessionStorage.getItem("userId");
        const userEmail = sessionStorage.getItem("email");

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
                    passengerName,
                    passengerPhone,
                    userId
                }
            );

            navigate("/confirmation", { state: response.data });
        } catch (err) {
            console.error("Booking error:", err);
            setError("Booking failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getSeatColor = (seatNum) => {
        if (isSeatSelected(seatNum)) return "#28a745";
        if (!isSeatAvailable(seatNum)) return "#dc3545";
        if (seatNum <= busData.availableSeats) return "#007bff";
        return "#6c757d";
    };

    return (
        <div style={{ padding: "40px", minHeight: "70vh", backgroundColor: "#f5f6fa" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                <h2 style={{ marginBottom: "20px" }}>Select Your Seats</h2>

                <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "1fr 350px", 
                    gap: "30px" 
                }}>
                    <div style={{ background: "white", padding: "30px", borderRadius: "12px" }}>
                        <div style={{ marginBottom: "20px", display: "flex", gap: "20px", justifyContent: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ width: "20px", height: "20px", background: "#007bff", borderRadius: "4px" }}></span>
                                <small>Available</small>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ width: "20px", height: "20px", background: "#28a745", borderRadius: "4px" }}></span>
                                <small>Selected</small>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <span style={{ width: "20px", height: "20px", background: "#dc3545", borderRadius: "4px" }}></span>
                                <small>Booked</small>
                            </div>
                        </div>

                        <div style={{ 
                            display: "flex", 
                            flexDirection: "column", 
                            gap: "10px",
                            alignItems: "center"
                        }}>
                            <div style={{ 
                                width: "100%", 
                                textAlign: "center", 
                                padding: "10px",
                                background: "#343a40",
                                color: "white",
                                borderRadius: "8px 8px 0 0"
                            }}>
                                FRONT
                            </div>
                            
                            {Array.from({ length: Math.ceil(totalSeats / seatsPerRow) }, (_, rowIndex) => (
                                <div key={rowIndex} style={{ display: "flex", gap: "15px" }}>
                                    {seatNumber.slice(rowIndex * seatsPerRow, (rowIndex + 1) * seatsPerRow).map((seatNum) => (
                                        <button
                                            key={seatNum}
                                            onClick={() => toggleSeat(seatNum)}
                                            disabled={!isSeatAvailable(seatNum) && !isSeatSelected(seatNum)}
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                border: "none",
                                                borderRadius: "8px",
                                                background: getSeatColor(seatNum),
                                                color: "white",
                                                cursor: isSeatAvailable(seatNum) || isSeatSelected(seatNum) ? "pointer" : "not-allowed",
                                                fontWeight: "bold",
                                                opacity: (!isSeatAvailable(seatNum) && !isSeatSelected(seatNum)) ? 0.5 : 1
                                            }}
                                        >
                                            {seatNum}
                                        </button>
                                    ))}
                                    {rowIndex % 2 === 0 && <div style={{ width: "30px" }}></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: "white", padding: "25px", borderRadius: "12px", height: "fit-content" }}>
                        <h3 style={{ marginBottom: "20px" }}>Booking Summary</h3>
                        
                        <div style={{ marginBottom: "15px" }}>
                            <strong>Bus:</strong> {busData.bus}
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                            <strong>From:</strong> {busData.from}
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                            <strong>To:</strong> {busData.to}
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                            <strong>Time:</strong> {busData.time}
                        </div>
                        <div style={{ marginBottom: "15px" }}>
                            <strong>Date:</strong> {busData.travelDate || "Not specified"}
                        </div>
                        
                        <hr style={{ margin: "20px 0" }} />
                        
                        <div style={{ marginBottom: "15px" }}>
                            <strong>Selected Seats:</strong> {selectedSeats.length > 0 ? selectedSeats.map(s => s.seatNumber).join(", ") : "None"}
                        </div>
                        
                        <div style={{ marginBottom: "20px" }}>
                            <strong>Price per seat:</strong> ${price}
                        </div>
                        
                        <div style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "20px" }}>
                            Total: ${totalPrice}
                        </div>

                        <hr style={{ margin: "20px 0" }} />

                        <h4 style={{ marginBottom: "15px" }}>Passenger Details</h4>
                        
                        <div style={{ marginBottom: "15px" }}>
                            <label style={{ display: "block", marginBottom: "5px" }}>Passenger Name:</label>
                            <input
                                type="text"
                                value={passengerName}
                                onChange={(e) => setPassengerName(e.target.value)}
                                placeholder="Enter passenger name"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "6px",
                                    border: "1px solid #ddd"
                                }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: "20px" }}>
                            <label style={{ display: "block", marginBottom: "5px" }}>Phone Number:</label>
                            <input
                                type="tel"
                                value={passengerPhone}
                                onChange={(e) => setPassengerPhone(e.target.value)}
                                placeholder="Enter phone number"
                                style={{
                                    width: "100%",
                                    padding: "10px",
                                    borderRadius: "6px",
                                    border: "1px solid #ddd"
                                }}
                            />
                        </div>

                        {error && (
                            <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
                        )}

                        <button
                            onClick={handleBooking}
                            disabled={loading || selectedSeats.length === 0}
                            style={{
                                width: "100%",
                                padding: "15px",
                                backgroundColor: loading ? "#ccc" : "#28a745",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "16px",
                                cursor: loading ? "not-allowed" : "pointer"
                            }}
                        >
                            {loading ? "Processing..." : "Confirm Booking"}
                        </button>

                        <button
                            onClick={() => navigate("/results", { state: [busData] })}
                            style={{
                                width: "100%",
                                marginTop: "10px",
                                padding: "12px",
                                backgroundColor: "transparent",
                                color: "#666",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                cursor: "pointer"
                            }}
                        >
                            Back to Results
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
