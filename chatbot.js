document.addEventListener('DOMContentLoaded', function() {
    // Chatbot HTML yapısını oluştur
    const chatbotHTML = `
        <div class="chatbot-container">
            <button class="chatbot-button" id="chatbotButton">
                <i class="fas fa-comments"></i>
            </button>
            <div class="chatbot-window" id="chatbotWindow">
                <div class="chatbot-header">
                    <h3>Spor Asistanı</h3>
                    <button class="chatbot-close" id="chatbotClose">&times;</button>
                </div>
                <div class="chatbot-messages" id="chatbotMessages">
                    <div class="message bot-message">
                        Merhaba! Ben spor asistanınızım. Size nasıl yardımcı olabilirim?
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatbotInput" placeholder="Mesajınızı yazın...">
                    <button id="chatbotSend">Gönder</button>
                </div>
            </div>
        </div>
    `;

    // Chatbot'u sayfaya ekle
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);

    // Elementleri seç
    const chatbotButton = document.getElementById('chatbotButton');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMessages = document.getElementById('chatbotMessages');

    // Chatbot'u aç/kapat
    chatbotButton.addEventListener('click', () => {
        chatbotWindow.style.display = 'flex';
        chatbotButton.style.display = 'none';
    });

    chatbotClose.addEventListener('click', () => {
        chatbotWindow.style.display = 'none';
        chatbotButton.style.display = 'flex';
    });

    // Mesaj gönderme fonksiyonu
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            // Kullanıcı mesajını ekle
            addMessage(message, 'user');
            chatbotInput.value = '';

            // Bot yanıtını simüle et
            setTimeout(() => {
                const botResponse = getBotResponse(message);
                addMessage(botResponse, 'bot');
            }, 500);
        }
    }

    // Mesaj ekleme fonksiyonu
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Bot yanıtlarını belirle
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Basit yanıt sistemi
        if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam')) {
            return 'Merhaba! Size nasıl yardımcı olabilirim?';
        }
        else if (lowerMessage.includes('egzersiz') || lowerMessage.includes('antrenman')) {
            return 'Egzersiz programları sayfamızda birçok farklı antrenman programı bulabilirsiniz. Size özel bir program oluşturmamı ister misiniz?';
        }
        else if (lowerMessage.includes('beslenme') || lowerMessage.includes('diyet')) {
            return 'Beslenme sayfamızda sağlıklı beslenme önerileri ve tarifler bulabilirsiniz. Kalori hesaplama aracımızı da kullanabilirsiniz.';
        }
        else if (lowerMessage.includes('kilo') || lowerMessage.includes('zayıflama')) {
            return 'Kilo verme sürecinizde size yardımcı olabilirim. Öncelikle kalori hesaplama sayfamızı ziyaret etmenizi öneririm.';
        }
        else if (lowerMessage.includes('kas') || lowerMessage.includes('güç')) {
            return 'Kas kazanma programlarımız ve beslenme önerilerimiz için kas kazanma sayfamızı ziyaret edebilirsiniz.';
        }
        else if (lowerMessage.includes('teşekkür') || lowerMessage.includes('sağol')) {
            return 'Rica ederim! Başka bir sorunuz varsa yardımcı olmaktan mutluluk duyarım.';
        }
        else {
            return 'Üzgünüm, bu konuda size yardımcı olamıyorum. Lütfen başka bir soru sorun veya ilgili sayfalarımızı ziyaret edin.';
        }
    }

    // Enter tuşu ile mesaj gönderme
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Gönder butonu ile mesaj gönderme
    chatbotSend.addEventListener('click', sendMessage);
}); 