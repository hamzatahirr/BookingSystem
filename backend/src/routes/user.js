const express = require('express');
const { getUserByEmail, getUserProfile } = require('../controllers/userController');
const auth = require('../middelware/auth');

const router = express.Router();

router.get('/user/:email', getUserByEmail);
router.get('/profile', auth, getUserProfile);

module.exports = router;