const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/preferences', authenticateToken, userController.getPreferences);
router.put('/preferences', authenticateToken, userController.updatePreferences);

module.exports = router;
