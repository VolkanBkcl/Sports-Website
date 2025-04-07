const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Kayıt ve giriş route'ları
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify-email', userController.verifyEmail);

// Profil route'ları (auth middleware ile korunuyor)
router.get('/me', auth, userController.getCurrentUser);
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);

module.exports = router; 