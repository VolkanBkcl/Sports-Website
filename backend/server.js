const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
// const programRoutes = require('./routes/programRoutes');
const contentRoutes = require('./routes/contentRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ana sayfa route'u
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Diğer sayfalar için route'lar
app.get('/programlar', (req, res) => {
    res.sendFile(__dirname + '/programlar.html');
});

app.get('/egzersizler', (req, res) => {
    res.sendFile(__dirname + '/egzersizler.html');
});

app.get('/beslenme', (req, res) => {
    res.sendFile(__dirname + '/beslenme.html');
});

app.get('/topluluk', (req, res) => {
    res.sendFile(__dirname + '/topluluk.html');
});

app.get('/iletisim', (req, res) => {
    res.sendFile(__dirname + '/iletisim.html');
});

app.get('/profile', (req, res) => {
    res.sendFile(__dirname + '/profile.html');
});

app.get('/admin-dashboard', (req, res) => {
    res.sendFile(__dirname + '/admin-dashboard.html');
});

app.get('/admin-users', (req, res) => {
    res.sendFile(__dirname + '/admin-users.html');
});

app.get('/admin-recipes', (req, res) => {
    res.sendFile(__dirname + '/admin-recipes.html');
});

app.get('/admin-exercises', (req, res) => {
    res.sendFile(__dirname + '/admin-exercises.html');
});

app.get('/admin-comments', (req, res) => {
    res.sendFile(__dirname + '/admin-comments.html');
});

app.get('/admin-settings', (req, res) => {
    res.sendFile(__dirname + '/admin-settings.html');
});

// Routes
app.use('/api/users', userRoutes);
// app.use('/api/programs', programRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/admin', adminRoutes);

app.use(express.static(__dirname));

// MongoDB Bağlantısı
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/byteforce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB bağlantısı başarılı'))
    .catch(err => console.error('MongoDB bağlantı hatası:', err));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Sunucu hatası', error: err.message });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
}); 