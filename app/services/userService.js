const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config');
const userModel = require('../models/userModel');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signup = async (userData) => {
    const { name, email, password, preferences } = userData;

    if (!email) throw new Error('Email is required');
    if (!emailRegex.test(email)) throw new Error('Invalid email format');
    if (!password || password.length < 6) throw new Error('Password must be at least 6 characters long');

    if (userModel.findByEmail(email)) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, config.bcryptSaltRounds);
    return userModel.create({ name, email, password: hashedPassword, preferences: preferences || [] });
};

const login = async (email, password) => {
    if (!email || !password) throw new Error('Email and password are required');

    const user = userModel.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid credentials');

    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

const getPreferences = async (email) => {
    const user = userModel.findByEmail(email);
    if (!user) throw new Error('User not found');
    return user.preferences;
};

const updatePreferences = async (email, preferences) => {
    const user = userModel.updatePreferences(email, preferences);
    if (!user) throw new Error('User not found');
    return user.preferences;
};

module.exports = { signup, login, getPreferences, updatePreferences };
