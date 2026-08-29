const users = [];

const findByEmail = (email) => {
    return users.find((user) => user.email === email);
};

const findAll = () => {
    return users;
};

const create = (userData) => {
    const user = { id: users.length + 1, ...userData };
    users.push(user);
    return user;
};

const updatePreferences = (email, preferences) => {
    const user = findByEmail(email);
    if (!user) return null;
    user.preferences = preferences;
    return user;
};

module.exports = { findByEmail, findAll, create, updatePreferences };
