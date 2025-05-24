const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Kayıt olma route'u
router.post('/register', authController.register);

// E-posta doğrulama route'u
router.get('/verify-email', authController.verifyEmail);

// Giriş yapma route'u
router.post('/login', authController.login);

module.exports = router; 