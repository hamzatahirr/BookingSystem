const express = require('express');
const { createBooking, getUserBookings, cancelBooking } = require('../controllers/bookingController');

const router = express.Router();

router.post('/booking', createBooking);
router.get('/bookings/:userId', getUserBookings);
router.put('/booking/:bookingId/cancel', cancelBooking);

module.exports = router;
