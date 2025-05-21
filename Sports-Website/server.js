app.get('/programlar', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, 'programlar.html'));
    } catch (error) {
        console.error('Programlar sayfası hatası:', error);
        res.status(500).send('Dosya bulunamadı');
    }
}); 