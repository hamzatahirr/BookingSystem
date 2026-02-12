const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const busRoutes = require('./routes/bus');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Ticket Booking API Running');
});

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', busRoutes);

module.exports = app;
