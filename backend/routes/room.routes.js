const express = require('express');
const { addRoom, getRooms } = require('../controllers/room.controller');
const authenticateToken = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/add-room', authenticateToken('admin'), addRoom);

router.get('/get-rooms', getRooms);

module.exports = router;
