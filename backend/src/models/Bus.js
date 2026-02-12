const mongoose = require('mongoose');

const BusSchema = new mongoose.Schema({
  busName: {
    type: String,
    required: [true, 'Please provide bus name'],
    trim: true
  },
  from: {
    type: String,
    required: [true, 'Please provide departure city'],
    trim: true,
    uppercase: true
  },
  to: {
    type: String,
    required: [true, 'Please provide destination city'],
    trim: true,
    uppercase: true
  },
  departureTime: {
    type: String,
    required: [true, 'Please provide departure time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/, 'Please provide time in HH:MM AM/PM format']
  },
  arrivalTime: {
    type: String,
    required: [true, 'Please provide arrival time'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/, 'Please provide time in HH:MM AM/PM format']
  },
  price: {
    type: Number,
    required: [true, 'Please provide ticket price'],
    min: [0, 'Price cannot be negative']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Please provide total seats'],
    min: [1, 'Total seats must be at least 1']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Please provide available seats'],
    min: [0, 'Available seats cannot be negative']
  },
  busType: {
    type: String,
    enum: ['Standard', 'Express', 'Luxury', 'Sleeper'],
    default: 'Standard'
  },
  amenities: [{
    type: String
  }],
  operatingDays: [{
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  }]
}, {
  timestamps: true
});

BusSchema.index({ from: 1, to: 1 });

module.exports = mongoose.model('Bus', BusSchema);