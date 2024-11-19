const Room = require('../models/room.model');

const addRoom = async (req, res) => {
    const { name, location, capacity, equipment, description } = req.body;

    try {
        const existingRoom = await Room.findOne({ name });
        if (existingRoom) {
            return res.status(400).json({ message: 'Room already exists' });
        }

        const newRoom = await Room.create({
            name,
            location,
            capacity,
            equipment,
            description
        });

        res.status(201).json({ message: 'Room added successfully', room: newRoom });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add room', error: error.message });
    }
};

const getRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).json({ rooms });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch rooms', error: error.message });
    }
}


module.exports = { addRoom, getRooms };
