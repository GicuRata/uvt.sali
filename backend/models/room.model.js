const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    equipment: { type: [String], default: [] }, // Optional
    description: { type: String }, // Optional for extra details
});

module.exports = mongoose.model('Room', roomSchema);
