const express = require('express');
const app = express();
const port = 6000;

app.get('/api', (req, res) => {
    res.send('Hello from the Node.js backend!');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
});
