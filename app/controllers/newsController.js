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
        const articles = await newsService.searchNews(req.params.keyword);
        res.status(200).json({ news: articles });
    } catch (err) {
        next(err);
    }
};

const markAsRead = (req, res, next) => {
    try {
        const articles = newsModel.markAsRead(req.user.email, req.params.id);
        res.status(200).json({ message: 'Article marked as read', read: articles });
    } catch (err) {
        next(err);
    }
};

const markAsFavorite = (req, res, next) => {
    try {
        const articles = newsModel.markAsFavorite(req.user.email, req.params.id);
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
