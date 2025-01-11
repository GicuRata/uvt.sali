const mongoose = require("mongoose");

const guestBookingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // HH:mm
  endTime: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "denied"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GuestBooking", guestBookingSchema);
