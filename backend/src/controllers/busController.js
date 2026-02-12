const Bus = require('../models/Bus');

const searchBuses = async (req, res) => {
  try {
    const { from, to, date } = req.body;

    if (!from || !to || !date) {
      return res.status(400).json({ 
        message: 'Please provide from, to, and date' 
      });
    }

    const searchDate = new Date(date);
    const dayOfWeek = searchDate.toLocaleDateString('en-US', { weekday: 'long' });

    const buses = await Bus.find({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      operatingDays: { $in: [dayOfWeek] },
      availableSeats: { $gt: 0 }
    }).sort({ departureTime: 1 });

    const formattedBuses = buses.map(bus => ({
      id: bus._id,
      bus: bus.busName,
      from: bus.from,
      to: bus.to,
      time: bus.departureTime,
      price: `$${bus.price}`,
      arrivalTime: bus.arrivalTime,
      busType: bus.busType,
      availableSeats: bus.availableSeats,
      totalSeats: bus.totalSeats,
      amenities: bus.amenities
    }));

    res.json(formattedBuses);
  } catch (error) {
    console.error('Search buses error:', error);
    res.status(500).json({ message: 'Server error while searching buses' });
  }
};

const getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ from: 1, to: 1 });
    res.json(buses);
  } catch (error) {
    console.error('Get all buses error:', error);
    res.status(500).json({ message: 'Server error while fetching buses' });
  }
};

const addBus = async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json({ message: 'Bus added successfully', bus });
  } catch (error) {
    console.error('Add bus error:', error);
    res.status(500).json({ message: 'Server error while adding bus' });
  }
};

module.exports = {
  searchBuses,
  getAllBuses,
  addBus,
};