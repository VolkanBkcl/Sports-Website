const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const programRoutes = require('./routes/programRoutes');
const contentRoutes = require('./routes/contentRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/adminRoutes');

// Environment variables
dotenv.config();

// JWT_SECRET kontrolü
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable tanımlanmamış!');
    process.env.JWT_SECRET = 'gecici-jwt-secret-key-123'; // Geçici olarak bir secret key tanımla
    console.warn('Geçici JWT_SECRET kullanılıyor. Lütfen .env dosyasına JWT_SECRET ekleyin!');
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyaları sun
app.use(express.static(__dirname));

// API Routes - Önce API route'larını tanımla
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/users', profileRoutes);
app.use('/api/admin', adminRoutes);

// Sayfa route'ları
const routes = [
    { path: '/', file: 'index.html' },
    { path: '/programlar', file: 'programlar.html' },
    { path: '/egzersizler', file: 'egzersizler.html' },
    { path: '/beslenme', file: 'beslenme.html' },
    { path: '/topluluk', file: 'topluluk.html' },
    { path: '/iletisim', file: 'iletisim.html' },
    { path: '/profile', file: 'profile.html' },
    { path: '/admin-login', file: 'admin-login.html' },
    { path: '/admin-dashboard', file: 'admin-dashboard.html' }
];

// Her route için handler oluştur
routes.forEach(route => {
    app.get(route.path, (req, res, next) => {
        // Eğer dosya varsa gönder, yoksa next() ile devam et
        res.sendFile(path.join(__dirname, route.file), (err) => {
            if (err) {
                next(err);
            }
        });
    });
});

// 404 handler - Sadece HTML isteklerini ana sayfaya yönlendir
app.use((req, res) => {
    // Eğer istek /api ile başlıyorsa, 404 JSON yanıtı döndür
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint bulunamadı' });
    }
    
    // HTML istekleri için ana sayfaya yönlendir
    if (req.accepts('html')) {
        res.redirect('/');
    } else {
        res.status(404).json({ error: 'Sayfa bulunamadı' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
});

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/byteforce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
}); 