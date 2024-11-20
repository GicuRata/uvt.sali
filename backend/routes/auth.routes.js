const express = require('express');
const { register, login, createAdmin } = require('../controllers/auth.controller');
const authenticateToken = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/register', register);

router.post('/login', login);

router.post('/create-admin', authenticateToken('admin'), createAdmin);

module.exports = router;

