const config = require('../config');
const userModel = require('../models/userModel');
const { fetchFromNewsAPI, cache } = require('./newsService');

let intervalId = null;

const refreshAllUsers = () => {
    const users = userModel.findAll();
    console.log(`Refreshing cache for ${users.length} user(s)...`);

    for (const user of users) {
        try {
            const articles = fetchFromNewsAPI(user.preferences);
            cache.set(`news:${user.email}`, articles);
            console.log(`Cache refreshed for ${user.email}`);
        } catch (error) {
            console.error(`Failed to refresh cache for ${user.email}:`, error.message);
        }
    }
};

const start = () => {
    if (intervalId) return;

    console.log(`Starting periodic cache refresh every ${config.cacheRefreshIntervalMs / 1000}s`);
    refreshAllUsers();
    intervalId = setInterval(refreshAllUsers, config.cacheRefreshIntervalMs);
};

const stop = () => {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        console.log('Stopped periodic cache refresh');
    }
};

module.exports = { start, stop, refreshAllUsers };
