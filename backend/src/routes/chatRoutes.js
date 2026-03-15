const express = require('express');
const router = express.Router();
const { chat, getChatHistory, getAvailableCities } = require('../controllers/chatController');

router.post('/chat', chat);
router.get('/chat/:sessionId', getChatHistory);
router.get('/cities', getAvailableCities);

module.exports = router;