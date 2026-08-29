const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/userModel');
const { createError, findUserOrThrow } = require('../helpers');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signup = async (userData) => {
    const { name, email, password, preferences } = userData;

    if (!email) throw createError('Email is required', 400);
    if (!emailRegex.test(email)) throw createError('Invalid email format', 400);
    if (!password || password.length < 6) throw createError('Password must be at least 6 characters long', 400);
    if (preferences && !Array.isArray(preferences)) throw createError('Preferences must be an array', 400);

    if (userModel.findByEmail(email)) {
        throw createError('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);
    return userModel.create({ name, email, password: hashedPassword, preferences: preferences || [] });
};

const login = async (email, password) => {
    if (!email || !password) throw createError('Email and password are required', 400);

    const user = userModel.findByEmail(email);
    if (!user) throw createError('Invalid credentials', 401);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw createError('Invalid credentials', 401);

    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

const getPreferences = (email) => {
    const user = findUserOrThrow(email);
    return user.preferences;
};

const updatePreferences = (email, preferences) => {
    if (!preferences || !Array.isArray(preferences)) throw createError('Preferences must be an array', 400);
    const user = userModel.updatePreferences(email, preferences);
    if (!user) throw createError('User not found', 404);
    return user.preferences;
};

module.exports = { signup, login, getPreferences, updatePreferences };
