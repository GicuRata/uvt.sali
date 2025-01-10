const express = require('express');
const { register, login, createAdmin } = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth.middleware');
const { validateToken } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/create-admin', authenticateToken('admin'), createAdmin);

router.get("/validate", validateToken);

module.exports = router;

