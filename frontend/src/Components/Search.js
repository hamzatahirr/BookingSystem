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
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      // ⭐ Use ENV variable (VERY professional practice)
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/search`,
        searchData
      );

      // Navigate to results page with search data
      navigate("/results", { state: { ...response.data, searchData } });

    } catch (error) {

      console.log("Backend not connected yet");

      // Smart Dummy Data
      const dummyBuses = [
        {
          id: 1,
          bus: "Express Line",
          from: searchData.from,
          to: searchData.to,
          time: "10:00 AM",
          arrivalTime: "4:00 PM",
          price: "$15",
          availableSeats: 20,
          totalSeats: 40,
          busType: "Express"
        },
        {
          id: 2,
          bus: "Super Coach",
          from: searchData.from,
          to: searchData.to,
          time: "2:00 PM",
          arrivalTime: "8:00 PM",
          price: "$18",
          availableSeats: 15,
          totalSeats: 40,
          busType: "Standard"
        }
      ];

      navigate("/results", { state: { ...dummyBuses, searchData } });

      setError("Backend not connected. Showing demo data.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Search Buses</h1>

      <form
        onSubmit={handleSearch}
        style={{
          maxWidth: "500px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >

        <input
          name="from"
          placeholder="From"
          onChange={handleChange}
          required
        />

        <input
          name="to"
          placeholder="To"
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="date"
          onChange={handleChange}
          required
        />

        <button type="submit">
          {loading ? "Searching..." : "Search"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

      </form>
    </div>
  );
}
