const axios = require('axios');
const config = require('../config');
const { mapArticle } = require('../models/newsModel');

const cache = {};

const getCache = (key) => {
    const entry = cache[key];
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
        delete cache[key];
        return null;
    }
    return entry.value;
};

const setCache = (key, value) => {
    cache[key] = {
        value,
        expiresAt: Date.now() + config.cacheTtlMs,
    };
};

const fetchFromNewsAPI = async (preferences, keyword) => {
    const params = {
        apiKey: config.newsApiKey,
        q: keyword || preferences.join(' OR '),
        sortBy: 'publishedAt',
    };
    const response = await axios.get('https://newsapi.org/v2/everything', { params, timeout: 10000 });
    const articles = response.data?.articles || [];
    return articles.map(mapArticle);
};

const getNews = async (email) => {
    const userModel = require('../models/userModel');
    const user = userModel.findByEmail(email);
    if (!user) {
        const err = new Error('User not found');
        err.statusCode = 404;
        throw err;
    }

    const cacheKey = `news:${email}`;
    try {
        const cached = getCache(cacheKey);
        if (cached) return cached;

        const articles = await fetchFromNewsAPI(user.preferences);
        setCache(cacheKey, articles);
        return articles;
    } catch (error) {
        console.error('Error fetching news:', error.message);
        throw new Error('Failed to fetch news');
    }
};

const searchNews = async (keyword) => {
    try {
        return await fetchFromNewsAPI([], keyword);
    } catch (error) {
        console.error('Error searching news:', error.message);
        throw new Error('Failed to search news');
    }
};

module.exports = { getNews, searchNews, fetchFromNewsAPI, cache: { get: getCache, set: setCache } };
