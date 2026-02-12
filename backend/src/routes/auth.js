const express = require('express');
const { signup, login, forgetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgetpassword', forgetPassword);

module.exports = router;