require('dotenv').config();

const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'news-aggregator-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    bcryptSaltRounds: 10,
    newsApiKey: process.env.NEWS_API_KEY,
    cacheTtlMs: parseInt(process.env.CACHE_TTL_MS) || 5 * 60 * 1000,
    cacheRefreshIntervalMs: parseInt(process.env.CACHE_REFRESH_INTERVAL_MS) || 5 * 60 * 1000,
};

module.exports = config;
