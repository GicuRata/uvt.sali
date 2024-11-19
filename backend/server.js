const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');


dotenv.config();
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const PORT = process.env.PORT || 6900;

// const __dirname = path.resolve();

const authRoute = require('./routes/auth.routes');
app.use('/api/auth', authRoute);

const roomRoute = require('./routes/room.routes');
app.use('/api/rooms', roomRoute);

//default route
app.get('/', (req, res) => {
    res.send('Welcome to the server');
});



// if (process.env.NODE_ENV === "production") {
//     app.use(express.static(path.join(__dirname, "../frontend/dist")));
//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, "..", "frontend", "dist", "index.html"));
//     });
// }

app.listen(PORT, () => {
    connectDB();
    console.log(`Server started at http://localhost:${PORT}`);
});

