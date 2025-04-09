const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const programRoutes = require('./routes/programRoutes');
const contentRoutes = require('./routes/contentRoutes');

// Environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

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

app.get('/spor-urunleri', (req, res) => {
    res.sendFile(__dirname + '/spor-urunleri.html');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/content', contentRoutes);

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
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
}); 