const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.statusCode) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    if (err.message === 'Invalid credentials') {
        return res.status(401).json({ error: err.message });
    }

    if (err.message === 'User already exists' ||
        err.message === 'Email is required' ||
        err.message === 'Invalid email format' ||
        err.message === 'Password must be at least 6 characters long' ||
        err.message === 'Email and password are required') {
        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: err.message || 'Internal Server Error' });
};

module.exports = { errorHandler };
