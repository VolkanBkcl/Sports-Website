const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Admin login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
        }
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Şifre hatalı.' });
        }
        admin.lastLogin = new Date();
        await admin.save();
        const token = admin.generateAuthToken();
        res.json({ token, admin: { username: admin.username, fullName: admin.fullName, role: admin.role } });
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

// Middleware: Admin Auth
function adminAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token gerekli.' });
    jwt.verify(token, process.env.JWT_SECRET, (err, admin) => {
        if (err) return res.status(403).json({ message: 'Geçersiz token.' });
        req.admin = admin;
        next();
    });
}

// Kullanıcıları listele
router.get('/users', adminAuth, async (req, res) => {
    try {
        const users = await User.find({}, '-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

// Kullanıcı düzenle
router.put('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

// Kullanıcı sil
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        res.json({ message: 'Kullanıcı silindi.' });
    } catch (err) {
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

module.exports = router; 