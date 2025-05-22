const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const programRoutes = require('./routes/programRoutes');
const contentRoutes = require('./routes/contentRoutes');
const authRoutes = require('./routes/authRoutes');

// Environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Statik dosyaları sun
app.use(express.static(__dirname));

// Sayfa route'ları
const routes = [
    { path: '/', file: 'index.html' },
    { path: '/programlar', file: 'programlar.html' },
    { path: '/egzersizler', file: 'egzersizler.html' },
    { path: '/beslenme', file: 'beslenme.html' },
    { path: '/topluluk', file: 'topluluk.html' },
    { path: '/iletisim', file: 'iletisim.html' },
    { path: '/profile', file: 'profile.html' }
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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/content', contentRoutes);

// 404 handler - Sayfa bulunamadığında ana sayfaya yönlendir
app.use((req, res) => {
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