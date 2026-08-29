const axios = require('axios');
const config = require('../config');
const { createError, findUserOrThrow } = require('../helpers');
const { mapArticle } = require('../models/newsModel');
const CacheService = require('./cacheService');

const cache = new CacheService();

const buildQueryParams = (preferences, keyword) => {
    const params = {};
    params.q = keyword || preferences.join(' OR ');
    params.sortBy = 'publishedAt';
    return params;
};

const fetchFromNewsAPI = async (preferences, keyword) => {
    const params = { apiKey: config.newsApiKey, ...buildQueryParams(preferences, keyword) };
    const response = await axios.get('https://newsapi.org/v2/everything', { params, timeout: 10000 });
    const articles = response.data?.articles || [];
    return articles.map(mapArticle);
};

const getNews = async (email) => {
    const user = findUserOrThrow(email);

    if (!config.newsApiKey) {
        throw createError('News API key not configured', 502);
    }

    const cacheKey = `news:${email}`;

    try {
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        const articles = await fetchFromNewsAPI(user.preferences);
        cache.set(cacheKey, articles);
        return articles;
    } catch (error) {
        console.error('Error fetching news:', error.message);
        throw createError('Failed to fetch news', 502);
    }
};

const searchNews = async (keyword) => {
    if (!keyword || keyword.trim().length === 0) {
        throw createError('Search keyword is required', 400);
    }

    if (!config.newsApiKey) {
        throw createError('News API key not configured', 502);
    }

    try {
        return await fetchFromNewsAPI([], keyword);
    } catch (error) {
        console.error('Error searching news:', error.message);
        throw createError('Failed to search news', 502);
    }
};

module.exports = { getNews, searchNews, fetchFromNewsAPI, cache };
