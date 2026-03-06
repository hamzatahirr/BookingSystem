const express = require('express');
const { submitHelpQuery, getAllHelpQueries } = require('../controllers/helpController');

const router = express.Router();

router.post('/help', submitHelpQuery);
router.get('/help', getAllHelpQueries);

module.exports = router;
