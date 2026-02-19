const Booking = require('../models/Booking');
const Bus = require('../models/Bus');

const createBooking = async (req, res) => {
  try {
    const { 
      busId, 
      busName, 
      from, 
      to, 
      departureTime, 
      arrivalTime,
      seats, 
      totalPrice, 
      travelDate,
      passengerName,
      passengerPhone,
      userId 
    } = req.body;

    if (!busId || !seats || seats.length === 0 || !passengerName || !passengerPhone) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const bookedSeats = seats.map(seat => seat.seatNumber);
    
    const totalSeatsBooked = bus.availableSeats - bookedSeats.length;
    if (totalSeatsBooked < 0) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    await Bus.findByIdAndUpdate(busId, {
      availableSeats: totalSeatsBooked
    });

    const booking = await Booking.create({
      user: userId,
      bus: busId,
      busName,
      from,
      to,
      departureTime,
      arrivalTime,
      seats,
      totalPrice,
      travelDate,
      passengerName,
      passengerPhone,
      status: 'Confirmed'
    });

    res.status(201).json({
      message: 'Booking confirmed successfully',
      booking: {
        id: booking._id,
        busName: booking.busName,
        from: booking.from,
        to: booking.to,
        departureTime: booking.departureTime,
        seats: booking.seats,
        totalPrice: booking.totalPrice,
        travelDate: booking.travelDate,
        bookingDate: booking.bookingDate,
        status: booking.status,
        passengerName: booking.passengerName
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error while creating booking' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ user: userId })
      .sort({ bookingDate: -1 });

    const formattedBookings = bookings.map(booking => ({
      id: booking._id,
      busName: booking.busName,
      from: booking.from,
      to: booking.to,
      departureTime: booking.departureTime,
      arrivalTime: booking.arrivalTime,
      seats: booking.seats,
      totalPrice: booking.totalPrice,
      travelDate: booking.travelDate,
      bookingDate: booking.bookingDate,
      status: booking.status,
      passengerName: booking.passengerName,
      passengerPhone: booking.passengerPhone
    }));

    res.json(formattedBookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    await Booking.findByIdAndUpdate(bookingId, { status: 'Cancelled' });

    const bus = await Bus.findById(booking.bus);
    if (bus) {
      const seatsToRestore = booking.seats.length;
      await Bus.findByIdAndUpdate(booking.bus, {
        availableSeats: bus.availableSeats + seatsToRestore
      });
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error while cancelling booking' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking
};
