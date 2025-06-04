const express = require('express');
const router = express.Router();
const Admin = require('../backend/models/Admin');
const User = require('../backend/models/User');
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
        console.error('Login hatası:', err);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

// Geliştirme amaçlı: Admin kullanıcılarını listele
router.get('/check-admins', async (req, res) => {
    try {
        const admins = await Admin.find({}, '-password');
        res.json({
            adminCount: admins.length,
            admins: admins
        });
    } catch (err) {
        console.error('Admin listeleme hatası:', err);
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

// Geçici: İlk admin kullanıcısını oluştur
router.post('/create-first-admin', async (req, res) => {
    try {
        const adminCount = await Admin.countDocuments();
        if (adminCount > 0) {
            return res.status(400).json({ message: 'Zaten bir admin kullanıcısı var.' });
        }

        const admin = new Admin({
            username: 'admin',
            password: 'admin123',
            email: 'admin@example.com',
            fullName: 'Site Admin',
            role: 'admin'
        });

        await admin.save();
        res.status(201).json({ message: 'İlk admin kullanıcısı oluşturuldu.' });
    } catch (err) {
        console.error('Admin oluşturma hatası:', err);
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