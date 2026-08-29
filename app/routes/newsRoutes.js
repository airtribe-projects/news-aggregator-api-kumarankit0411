const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { authenticateToken } = require('../middleware/auth');

router.get('/search/:keyword', authenticateToken, newsController.searchNews);
router.get('/read', authenticateToken, newsController.getReadArticles);
router.get('/favorites', authenticateToken, newsController.getFavoriteArticles);
router.get('/', authenticateToken, newsController.getNews);
router.post('/:id/read', authenticateToken, newsController.markAsRead);
router.post('/:id/favorite', authenticateToken, newsController.markAsFavorite);

module.exports = router;
