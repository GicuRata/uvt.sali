const Booking = require("../models/booking.model");
const Room = require("../models/room.model");

// Helper: checks if two time spans overlap
// (startA < endB) AND (endA > startB)
function doesOverlap(startA, endA, startB, endB) {
    return startA < endB && endA > startB;
}

async function getAvailableRooms(req, res) {
    try {
        const { date, startTime, endTime } = req.query;

        // Find all APPROVED bookings on the requested date
        const approvedBookingsToday = await Booking.find({
            date,
            status: "approved",
        });

        // Filter those that overlap the requested time
        const overlappingApproved = approvedBookingsToday.filter((b) =>
            doesOverlap(startTime, endTime, b.startTime, b.endTime)
        );

        // Collect room IDs that are overlapping with an approved booking
        const bookedRoomIds = overlappingApproved.map((b) => b.room.toString());

        // Find rooms not in that set
        const availableRooms = await Room.find({ _id: { $nin: bookedRoomIds } });

        return res.status(200).json({ rooms: availableRooms });
    } catch (error) {
        console.error("getAvailableRooms error:", error);
        return res.status(500).json({ message: "Failed to fetch available rooms" });
    }
}

async function createBooking(req, res) {
    try {
        const { roomId, date, startTime, endTime } = req.body;
        const userId = req.user.id;

        // Basic time check
        if (startTime >= endTime) {
            return res
                .status(400)
                .json({ message: "Start time must be less than end time." });
        }

        // Check if room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // Check for overlapping *approved* bookings (ignore pending/denied)
        const approvedSameDayBookings = await Booking.find({
            room: roomId,
            date,
            status: "approved",
        });
        const conflict = approvedSameDayBookings.find((b) =>
            doesOverlap(startTime, endTime, b.startTime, b.endTime)
        );

        if (conflict) {
            return res
                .status(400)
                .json({ message: "Room is already booked (approved) for that time." });
        }

        const newBooking = await Booking.create({
            user: userId,
            room: roomId,
            date,
            startTime,
            endTime,
        });

        return res
            .status(201)
            .json({ message: "Booking created successfully", booking: newBooking });
    } catch (error) {
        console.error("createBooking error:", error);
        return res.status(500).json({ message: "Failed to create booking" });
    }
}

async function getUserBookings(req, res) {
    try {
        const userId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookings = await Booking.find({
            user: userId,
            date: { $gte: today },
        })
            .populate("room", "name location")
            .sort({ date: 1 });
        return res.status(200).json({ bookings });
    } catch (error) {
        console.error("getUserBookings error:", error);
        return res.status(500).json({ message: "Failed to fetch user bookings" });
    }
}

async function getAllBookings(req, res) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const bookings = await Booking.find({
            date: { $gte: today },
        })
            .populate("user", "username email")
            .populate("room", "name location")
            .sort({ date: 1 });

        return res.status(200).json({ bookings });
    } catch (error) {
        console.error("getAllBookings error:", error);
        return res.status(500).json({ message: "Failed to get all bookings" });
    }
}

async function approveBooking(req, res) {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check for overlap with other approved bookings
        const approvedBookingsSameDay = await Booking.find({
            _id: { $ne: booking._id },
            room: booking.room,
            date: booking.date,
            status: "approved",
        });

        const conflict = approvedBookingsSameDay.find((b) =>
            doesOverlap(booking.startTime, booking.endTime, b.startTime, b.endTime)
        );

        if (conflict) {
            return res.status(400).json({
                message: "Conflict: another booking is already approved in this time slot.",
            });
        }

        booking.status = "approved";
        await booking.save();
        return res.status(200).json({ message: "Booking approved", booking });
    } catch (error) {
        console.error("approveBooking error:", error);
        return res.status(500).json({ message: "Failed to approve booking" });
    }
}

async function denyBooking(req, res) {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        booking.status = "denied";
        await booking.save();
        return res.status(200).json({ message: "Booking denied", booking });
    } catch (error) {
        console.error("denyBooking error:", error);
        return res.status(500).json({ message: "Failed to deny booking" });
    }
}

async function cancelBooking(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const booking = await Booking.findById(id);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        if (req.user.role !== "admin" && booking.user.toString() !== userId) {
            return res.status(403).json({ message: "Not authorized to cancel" });
        }
        await Booking.findByIdAndDelete(id);
        return res.status(200).json({ message: "Booking canceled" });
    } catch (error) {
        console.error("cancelBooking error:", error);
        return res.status(500).json({ message: "Failed to cancel booking" });
    }
}

module.exports = {
    getAvailableRooms,
    createBooking,
    getUserBookings,
    getAllBookings,
    approveBooking,
    denyBooking,
    cancelBooking,
};
