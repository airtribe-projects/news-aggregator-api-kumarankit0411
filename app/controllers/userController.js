const userService = require('../services/userService');

const signup = async (req, res, next) => {
    try {
        await userService.signup(req.body);
        res.status(200).json({ message: 'User created successfully' });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const token = await userService.login(req.body.email, req.body.password);
        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};

const getPreferences = (req, res, next) => {
    try {
        const preferences = userService.getPreferences(req.user.email);
        res.status(200).json({ preferences });
    } catch (err) {
        next(err);
    }
};

const updatePreferences = (req, res, next) => {
    try {
        userService.updatePreferences(req.user.email, req.body.preferences);
        res.status(200).json({ message: 'Preferences updated successfully' });
    } catch (err) {
        next(err);
    }
};

module.exports = { signup, login, getPreferences, updatePreferences };
