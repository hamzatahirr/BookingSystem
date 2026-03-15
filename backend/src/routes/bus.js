const express = require('express');
const { searchBuses, getAllBuses, addBus, getCities } = require('../controllers/busController');
const auth = require('../middelware/auth');

const router = express.Router();

router.post('/search', searchBuses);
router.get('/all', getAllBuses);
router.get('/cities', getCities);
router.post('/add', auth, addBus);

module.exports = router;