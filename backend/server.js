const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const port = 6000;

dotenv.config();

app.get('/api', (req, res) => {
    res.send('Hello from the Node.js backend!');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
