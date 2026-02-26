import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState({
    from: "",
    to: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setSearchData({
      ...searchData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const validateForm = () => {
    if (!searchData.from.trim()) {
      setError("Please enter departure city");
      return false;
    }
    if (!searchData.to.trim()) {
      setError("Please enter destination city");
      return false;
    }
    if (!searchData.date) {
      setError("Please select travel date");
      return false;
    }
    if (searchData.from.toLowerCase() === searchData.to.toLowerCase()) {
      setError("Departure and destination cannot be the same");
      return false;
    }
    return true;
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/search`,
        searchData
      );

      if (response.data.length === 0) {
        setError("No buses found for this route. Try a different date.");
        setLoading(false);
        return;
      }

      navigate("/results", { state: { buses: response.data, searchData } });

    } catch (err) {
      const dummyBuses = [
        {
          id: 1,
          bus: "Express Line",
          from: searchData.from.toUpperCase(),
          to: searchData.to.toUpperCase(),
          time: "10:00 AM",
          arrivalTime: "4:00 PM",
          price: "$15",
          availableSeats: 20,
          totalSeats: 40,
          busType: "Express",
          travelDate: searchData.date
        },
        {
          id: 2,
          bus: "Super Coach",
          from: searchData.from.toUpperCase(),
          to: searchData.to.toUpperCase(),
          time: "2:00 PM",
          arrivalTime: "8:00 PM",
          price: "$18",
          availableSeats: 15,
          totalSeats: 40,
          busType: "Standard",
          travelDate: searchData.date
        }
      ];

      navigate("/results", { state: { buses: dummyBuses, searchData } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px 20px", minHeight: "70vh", backgroundColor: "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ 
        background: "white", 
        padding: "40px", 
        borderRadius: "16px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        maxWidth: "500px",
        width: "100%"
      }}>
        <h1 style={{ marginBottom: "10px", color: "#483f19", textAlign: "center" }}>Search Buses</h1>
        <p style={{ marginBottom: "30px", color: "#666", textAlign: "center" }}>Find your perfect bus ride</p>

        <form onSubmit={handleSearch}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#333" }}>From City</label>
            <input
              name="from"
              placeholder="Enter departure city"
              value={searchData.from}
              onChange={handleChange}
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

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#333" }}>To City</label>
            <input
              name="to"
              placeholder="Enter destination city"
              value={searchData.to}
              onChange={handleChange}
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

          <div style={{ marginBottom: "25px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "500", color: "#333" }}>Travel Date</label>
            <input
              type="date"
              name="date"
              value={searchData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
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

          {error && (
            <div style={{ 
              padding: "12px", 
              background: "#f8d7da", 
              color: "#721c24", 
              borderRadius: "8px", 
              marginBottom: "20px",
              textAlign: "center"
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: loading ? "#ccc" : "#483f19",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.3s"
            }}
          >
            {loading ? "🔍 Searching..." : "🔍 Search Buses"}
          </button>
        </form>
      </div>
    </div>
  );
}
