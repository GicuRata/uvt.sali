const express = require('express');
const { addRoom, getRooms, editRoom, deleteRoom, getRoomById } = require('../controllers/room.controller');
const authenticateToken = require('../middleware/auth.middleware');
const router = express.Router();

router.post('/add-room', authenticateToken('admin'), addRoom);

router.get('/get-rooms', getRooms);

router.delete('/delete-room/:id', authenticateToken('admin'), deleteRoom);

router.put('/edit-room/:id', authenticateToken('admin'), editRoom);

router.get('/get-room/:id', authenticateToken('admin'), getRoomById);

module.exports = router;