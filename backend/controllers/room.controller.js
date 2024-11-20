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

const deleteRoom = async (req, res) => {
    const { id } = req.params;

    try {
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        await Room.findByIdAndDelete(id);
        res.status(200).json({ message: 'Room deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete room', error: error.message });
    }
};

const editRoom = async (req, res) => {
    const { id } = req.params;
    const { name, location, capacity, equipment, description } = req.body;

    try {
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        room.name = name || room.name;
        room.location = location || room.location;
        room.capacity = capacity || room.capacity;
        room.equipment = equipment || room.equipment;
        room.description = description || room.description;

        await room.save();
        res.status(200).json({ message: 'Room updated successfully', room });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update room', error: error.message });
    }
};

const getRoomById = async (req, res) => {
    const { id } = req.params;

    try {
        const room = await Room.findById(id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        res.status(200).json({ room });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch room', error: error.message });
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


module.exports = { addRoom, getRooms, deleteRoom, editRoom, getRoomById };
