const GuestBooking = require("../models/guestbooking.model");
const Room = require("../models/room.model");
const Booking = require("../models/booking.model");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });


// Helper to check time overlap
function doesOverlap(startA, endA, startB, endB) {
    return startA < endB && endA > startB;
}
// console.log("EMAIL_USER:", process.env.EMAIL_USER);
// console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
// console.log("a", process.env.PORT)

// Setup a nodemailer transporter 
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Send an email (simple helper)
function sendEmail(to, subject, text) {
    transporter.sendMail(
        {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        },
        (err, info) => {
            if (err) {
                console.error("Email sending error:", err);
            } else {
                console.log("Email sent:", info.response);
            }
        }
    );
}

// Create a guest booking (no auth required)
exports.createGuestBooking = async (req, res) => {
    try {
        const { fullName, email, roomId, date, startTime, endTime } = req.body;

        // Basic time check
        if (startTime >= endTime) {
            return res
                .status(400)
                .json({ message: "Start time must be less than end time." });
        }

        // Check that room exists
        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        // 1) Check for overlap with any *approved* GuestBooking
        const approvedGuestBookings = await GuestBooking.find({
            room: roomId,
            date,
            status: "approved",
        });
        const conflictGuest = approvedGuestBookings.find((b) =>
            doesOverlap(startTime, endTime, b.startTime, b.endTime)
        );
        if (conflictGuest) {
            return res
                .status(400)
                .json({ message: "Room is already booked (guest approved) for that time." });
        }

        // 2) check also normal Bookings with status=approved
        // to block guests if there's an approved user booking
        const approvedUserBookings = await Booking.find({
            room: roomId,
            date,
            status: "approved", // only approved bookings matter
        });
        const conflictUser = approvedUserBookings.find((b) =>
            doesOverlap(startTime, endTime, b.startTime, b.endTime)
        );
        if (conflictUser) {
            return res
                .status(400)
                .json({ message: "Room is already booked (user approved) for that time." });
        }

        // Create the guest booking
        const newGuestBooking = await GuestBooking.create({
            fullName,
            email,
            room: roomId,
            date,
            startTime,
            endTime,
        });

        // Send confirmation email to the guest
        sendEmail(
            email,
            "Your Booking Request",
            `Hello ${fullName},\n\nYour booking request for ${room.name} is submitted (pending approval).\n`
        );

        return res.status(201).json({
            message: "Guest booking created (status: pending).",
            guestBooking: newGuestBooking,
        });
    } catch (error) {
        console.error("createGuestBooking error:", error);
        return res.status(500).json({ message: "Failed to create guest booking" });
    }
};

// Admin: get all guest bookings
exports.getAllGuestBookings = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const guestBookings = await GuestBooking.find({ date: { $gte: today }, })
            .populate("room", "name location")
            .sort({ createdAt: -1 });
        return res.status(200).json({ guestBookings });
    } catch (error) {
        console.error("getAllGuestBookings error:", error);
        return res.status(500).json({ message: "Failed to fetch guest bookings" });
    }
};

// Admin: approve a guest booking
exports.approveGuestBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const guestBooking = await GuestBooking.findById(id).populate("room");
        if (!guestBooking) {
            return res.status(404).json({ message: "Guest booking not found" });
        }

        // Check for overlap with other approved guest bookings
        const approvedSameDay = await GuestBooking.find({
            _id: { $ne: guestBooking._id },
            room: guestBooking.room,
            date: guestBooking.date,
            status: "approved",
        });
        const conflict = approvedSameDay.find((b) =>
            doesOverlap(
                guestBooking.startTime,
                guestBooking.endTime,
                b.startTime,
                b.endTime
            )
        );
        if (conflict) {
            return res.status(400).json({
                message:
                    "Conflict: another guest booking is already approved for this time slot.",
            });
        }

        // Also check normal user Bookings to block overlap
        const approvedUserBookings = await Booking.find({
            room: guestBooking.room,
            date: guestBooking.date,
            status: "approved",
        });
        const conflictUser = approvedUserBookings.find((b) =>
            doesOverlap(guestBooking.startTime, guestBooking.endTime, b.startTime, b.endTime)
        );
        if (conflictUser) {
            return res.status(400).json({
                message:
                    "Conflict: a user booking is already approved for this time slot.",
            });
        }

        guestBooking.status = "approved";
        await guestBooking.save();

        // Send email to guest
        sendEmail(
            guestBooking.email,
            "Booking Approved",
            `Hello ${guestBooking.fullName},\n\nYour booking for ${guestBooking.room.name} has been approved.\n`
        );

        return res.status(200).json({
            message: "Guest booking approved",
            guestBooking,
        });
    } catch (error) {
        console.error("approveGuestBooking error:", error);
        return res.status(500).json({ message: "Failed to approve guest booking" });
    }
};

// Admin: deny a guest booking
exports.denyGuestBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const guestBooking = await GuestBooking.findById(id).populate("room");
        if (!guestBooking) {
            return res.status(404).json({ message: "Guest booking not found" });
        }

        guestBooking.status = "denied";
        await guestBooking.save();

        // Email the guest
        sendEmail(
            guestBooking.email,
            "Booking Denied",
            `Hello ${guestBooking.fullName},\n\nYour booking for ${guestBooking.room.name} was denied.\n`
        );

        return res.status(200).json({
            message: "Guest booking denied",
            guestBooking,
        });
    } catch (error) {
        console.error("denyGuestBooking error:", error);
        return res.status(500).json({ message: "Failed to deny guest booking" });
    }
};
