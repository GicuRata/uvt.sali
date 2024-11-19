const jwt = require('jsonwebtoken');

const authenticateToken = (requiredRole = null) => (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user; // Attach user info to request

        // If a role is required, check if the user has the correct role
        if (requiredRole && user.role !== requiredRole) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }

        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;