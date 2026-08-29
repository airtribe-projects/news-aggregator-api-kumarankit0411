const newsService = require('../services/newsService');
const newsModel = require('../models/newsModel');

const getNews = async (req, res, next) => {
    try {
        const news = await newsService.getNews(req.user.email);
        res.status(200).json({ news });
    } catch (err) {
        next(err);
    }
};

const searchNews = async (req, res, next) => {
    try {
        const { keyword } = req.params;
        if (!keyword || keyword.trim().length === 0) {
            return res.status(400).json({ error: 'Search keyword is required' });
        }
        const articles = await newsService.searchNews(keyword);
        res.status(200).json({ news: articles });
    } catch (err) {
        next(err);
    }
};

const markAsRead = (req, res, next) => {
    try {
        const cached = newsService.cache.get(`news:${req.user.email}`);
        const articles = newsModel.markAsRead(req.user.email, req.params.id, cached);
        res.status(200).json({ message: 'Article marked as read', read: articles });
    } catch (err) {
        next(err);
    }
};

const markAsFavorite = (req, res, next) => {
    try {
        const cached = newsService.cache.get(`news:${req.user.email}`);
        const articles = newsModel.markAsFavorite(req.user.email, req.params.id, cached);
        res.status(200).json({ message: 'Article marked as favorite', favorites: articles });
    } catch (err) {
        next(err);
    }
};

const getReadArticles = (req, res, next) => {
    try {
        const articles = newsModel.getReadArticles(req.user.email);
        res.status(200).json({ read: articles });
    } catch (err) {
        next(err);
    }
};

const getFavoriteArticles = (req, res, next) => {
    try {
        const articles = newsModel.getFavoriteArticles(req.user.email);
        res.status(200).json({ favorites: articles });
    } catch (err) {
        next(err);
    }
};

module.exports = { getNews, searchNews, markAsRead, markAsFavorite, getReadArticles, getFavoriteArticles };
