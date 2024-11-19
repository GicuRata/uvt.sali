const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
    date: { type: Date, required: true }, // Only the date
    startTime: { type: String, required: true }, // Format: HH:mm
    endTime: { type: String, required: true }, // Format: HH:mm
    status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
