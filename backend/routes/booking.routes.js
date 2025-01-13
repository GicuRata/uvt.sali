const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/auth.middleware");

const {
    getAvailableRooms,
    createBooking,
    getUserBookings,
    getAllBookings,
    approveBooking,
    denyBooking,
    cancelBooking,
    adminCancelBooking,
} = require("../controllers/booking.controller");

router.get("/available-rooms", authenticateToken(), getAvailableRooms);

router.post("/create-booking", authenticateToken(), createBooking);

router.get("/my-bookings", authenticateToken(), getUserBookings);

router.get("/all-bookings", authenticateToken("admin"), getAllBookings);

router.patch("/approve/:id", authenticateToken("admin"), approveBooking);
router.patch("/deny/:id", authenticateToken("admin"), denyBooking);

router.delete("/cancel/:id", authenticateToken(), cancelBooking);

router.delete("/admin-cancel/:id", authenticateToken("admin"), adminCancelBooking);

module.exports = router;
