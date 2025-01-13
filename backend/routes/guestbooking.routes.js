const express = require("express");
const router = express.Router();
const {
    createGuestBooking,
    getAllGuestBookings,
    approveGuestBooking,
    denyGuestBooking,
    cancelGuestBooking,
} = require("../controllers/guestbooking.controller");
const authenticateToken = require("../middleware/auth.middleware");

// Public route - no auth needed for creating a guest booking
router.post("/create", createGuestBooking);

// Admin routes
router.get("/all", authenticateToken("admin"), getAllGuestBookings);
router.patch("/approve/:id", authenticateToken("admin"), approveGuestBooking);
router.patch("/deny/:id", authenticateToken("admin"), denyGuestBooking);
router.delete("/admin-cancel/:id", authenticateToken("admin"), cancelGuestBooking);

module.exports = router;
