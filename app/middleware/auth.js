const jwt = require('jsonwebtoken');
const config = require('../config');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access token is required' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, config.jwtSecret, (err, user) => {
        if (err) return res.status(401).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

module.exports = { authenticateToken };
