require('dotenv').config();
const mongoose = require('mongoose');
const Bus = require('../models/Bus');
const connectDB = require('../config/db');

const seedBuses = async () => {
  try {
    await connectDB();
    
    await Bus.deleteMany({});
    
    const buses = [
      {
        busName: "Express Line",
        from: "NEW YORK",
        to: "BOSTON",
        departureTime: "08:00 AM",
        arrivalTime: "11:30 AM",
        price: 45,
        totalSeats: 50,
        availableSeats: 35,
        busType: "Express",
        amenities: ["WiFi", "AC", "Charging Points"],
        operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      },
      {
        busName: "Super Coach",
        from: "NEW YORK",
        to: "BOSTON",
        departureTime: "02:00 PM",
        arrivalTime: "05:30 PM",
        price: 38,
        totalSeats: 45,
        availableSeats: 28,
        busType: "Standard",
        amenities: ["AC", "Charging Points"],
        operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      },
      {
        busName: "Luxury Express",
        from: "NEW YORK",
        to: "WASHINGTON DC",
        departureTime: "09:00 AM",
        arrivalTime: "12:30 PM",
        price: 55,
        totalSeats: 40,
        availableSeats: 22,
        busType: "Luxury",
        amenities: ["WiFi", "AC", "Charging Points", "Refreshments", "Extra Legroom"],
        operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      },
      {
        busName: "Night Rider",
        from: "NEW YORK",
        to: "CHICAGO",
        departureTime: "09:00 PM",
        arrivalTime: "07:00 AM",
        price: 120,
        totalSeats: 35,
        availableSeats: 18,
        busType: "Sleeper",
        amenities: ["WiFi", "AC", "Charging Points", "Sleeping Berths", "Blankets"],
        operatingDays: ["Friday", "Saturday", "Sunday"]
      },
      {
        busName: "City Link",
        from: "BOSTON",
        to: "NEW YORK",
        departureTime: "10:00 AM",
        arrivalTime: "01:30 PM",
        price: 45,
        totalSeats: 50,
        availableSeats: 31,
        busType: "Express",
        amenities: ["WiFi", "AC", "Charging Points"],
        operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
      },
      {
        busName: "Economy Service",
        from: "PHILADELPHIA",
        to: "NEW YORK",
        departureTime: "07:30 AM",
        arrivalTime: "10:00 AM",
        price: 25,
        totalSeats: 55,
        availableSeats: 42,
        busType: "Standard",
        amenities: ["AC"],
        operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      },
      {
        busName: "Business Class",
        from: "WASHINGTON DC",
        to: "NEW YORK",
        departureTime: "03:00 PM",
        arrivalTime: "06:30 PM",
        price: 75,
        totalSeats: 30,
        availableSeats: 15,
        busType: "Luxury",
        amenities: ["WiFi", "AC", "Charging Points", "Refreshments", "Extra Legroom", "Business Lounge"],
        operatingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      },
      {
        busName: "Weekend Special",
        from: "NEW YORK",
        to: "ATLANTIC CITY",
        departureTime: "08:00 AM",
        arrivalTime: "11:00 AM",
        price: 35,
        totalSeats: 45,
        availableSeats: 38,
        busType: "Express",
        amenities: ["WiFi", "AC", "Charging Points"],
        operatingDays: ["Saturday", "Sunday"]
      }
    ];

    await Bus.insertMany(buses);
    console.log('Sample buses inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding buses:', error);
    process.exit(1);
  }
};

seedBuses();