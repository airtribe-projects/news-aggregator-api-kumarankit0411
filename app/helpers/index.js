const userModel = require('../models/userModel');

const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};

const findUserOrThrow = (email) => {
    const user = userModel.findByEmail(email);
    if (!user) {
        throw createError('User not found', 404);
    }
    return user;
};

module.exports = { createError, findUserOrThrow };
