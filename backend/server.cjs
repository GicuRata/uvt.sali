const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { fileURLToPath } = require('url');
const connectDB = require('./config/db.js');
const authRoute = require('./routes/auth.routes.js');
const roomRoute = require('./routes/room.routes.js');
const bookingRoute = require('./routes/booking.routes.js');
const guestBookingRoute = require('./routes/guestbooking.routes.js');

// Load environment variables from the parent directory
// dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 6900;

// Resolve __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// Use routes
app.use('/api/auth', authRoute);
app.use('/api/rooms', roomRoute);
app.use('/api/bookings', bookingRoute);
app.use('/api/guest-bookings', guestBookingRoute);


// Serve static files in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.use('/public', express.static(path.join(__dirname, "../frontend/public"))); // Add this line
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "..", "frontend", "dist", "index.html"));
    });
}

// Start the server
app.listen(PORT, () => {
    connectDB(); // Ensure this function is defined to connect to your database
    console.log(`Server started at http://localhost:${PORT}`);
});
