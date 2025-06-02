// Tüm HTML sayfalarına chatbot eklemek için script
const htmlFiles = [
    'index.html',
    'programlar.html',
    'egzersizler.html',
    'beslenme.html',
    'topluluk.html',
    'iletisim.html',
    'giris.html',
    'kayitol.html',
    'profile.html',
    'kalori-hesaplama.html',
    'tarifler.html',
    'haftalik-plan.html',
    'kilo-verme.html',
    'kas-kazanma.html'
];

const fs = require('fs');
const path = require('path');

// Her HTML dosyası için chatbot'u ekle
htmlFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    
    // Dosya var mı kontrol et
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Head bölümüne CSS ve Font Awesome ekle
        if (!content.includes('chatbot.css')) {
            content = content.replace(
                '</head>',
                '    <link rel="stylesheet" href="chatbot.css">\n</head>'
            );
        }
        
        // Body sonuna script ekle
        if (!content.includes('chatbot.js')) {
            content = content.replace(
                '</body>',
                '    <script src="chatbot.js"></script>\n</body>'
            );
        }
        
        // Değişiklikleri kaydet
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Chatbot added to ${file}`);
    } else {
        console.log(`File not found: ${file}`);
    }
}); 