const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Create admin account
const createAdmin = async (req, res) => {
    const { username, email, password, adminSecret } = req.body;

    // Validate the admin secret
    if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: 'Invalid admin secret' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newAdmin = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        res.status(201).json({ message: 'Admin account created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong' });
    }
};

// Register a new user
const register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'user',
        });

        // Send a successful response
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong here' });
    }
};

// Login user
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials (user not found)' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials (password)' });
        }

        const token = jwt.sign(
            { id: user._id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};



module.exports = { register, login, createAdmin };
