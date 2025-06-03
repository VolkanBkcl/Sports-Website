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
        messageDiv.innerHTML = text;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Bot yanıtlarını belirle
    function getBotResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Antrenman programı ile ilgili sorular
        if (lowerMessage.includes('antrenman programı') || lowerMessage.includes('spor programı')) {
            if (lowerMessage.includes('kilo') || lowerMessage.includes('zayıflama')) {
                return 'Kilo verme antrenman programı için <a href="kilo-verme.html" target="_blank" style="color: #007bff; text-decoration: underline;">kilo verme programı sayfamızı</a> ziyaret edebilirsiniz. Ayrıca <a href="haftalik-plan.html" target="_blank" style="color: #007bff; text-decoration: underline;">haftalık plan oluşturma sayfamızdan</a> size özel bir program oluşturabilirsiniz.';
            }
            else if (lowerMessage.includes('kas') || lowerMessage.includes('güç')) {
                return 'Kas kazanma antrenman programı için <a href="kas-kazanma.html" target="_blank" style="color: #007bff; text-decoration: underline;">kas kazanma programı sayfamızı</a> ziyaret edebilirsiniz. Ayrıca <a href="haftalik-plan.html" target="_blank" style="color: #007bff; text-decoration: underline;">haftalık plan oluşturma sayfamızdan</a> size özel bir program oluşturabilirsiniz.';
            }
            else {
                return 'Size özel antrenman programı oluşturmak için <a href="haftalik-plan.html" target="_blank" style="color: #007bff; text-decoration: underline;">haftalık plan oluşturma sayfamızı</a> ziyaret edebilirsiniz. Ayrıca <a href="programlar.html" target="_blank" style="color: #007bff; text-decoration: underline;">hazır programlar sayfamızdan</a> size uygun bir program seçebilirsiniz.';
            }
        }

        // Beslenme programı ile ilgili sorular
        else if (lowerMessage.includes('beslenme programı') || lowerMessage.includes('diyet programı')) {
            if (lowerMessage.includes('kilo') || lowerMessage.includes('zayıflama')) {
                return 'Kilo verme beslenme programı için <a href="kilo-verme.html" target="_blank" style="color: #007bff; text-decoration: underline;">kilo verme programı sayfamızı</a> ziyaret edebilirsiniz. Önce <a href="kalori-hesaplama.html" target="_blank" style="color: #007bff; text-decoration: underline;">kalori ihtiyacınızı hesaplayın</a>, sonra <a href="beslenme.html" target="_blank" style="color: #007bff; text-decoration: underline;">beslenme sayfamızdan</a> size uygun bir program seçin.';
            }
            else if (lowerMessage.includes('kas') || lowerMessage.includes('güç')) {
                return 'Kas kazanma beslenme programı için <a href="kas-kazanma.html" target="_blank" style="color: #007bff; text-decoration: underline;">kas kazanma programı sayfamızı</a> ziyaret edebilirsiniz. Önce <a href="kalori-hesaplama.html" target="_blank" style="color: #007bff; text-decoration: underline;">kalori ihtiyacınızı hesaplayın</a>, sonra <a href="beslenme.html" target="_blank" style="color: #007bff; text-decoration: underline;">beslenme sayfamızdan</a> size uygun bir program seçin.';
            }
            else {
                return 'Size özel beslenme programı için önce <a href="kalori-hesaplama.html" target="_blank" style="color: #007bff; text-decoration: underline;">kalori ihtiyacınızı hesaplayın</a>, sonra <a href="beslenme.html" target="_blank" style="color: #007bff; text-decoration: underline;">beslenme sayfamızdan</a> size uygun bir program seçin. Ayrıca <a href="tarifler.html" target="_blank" style="color: #007bff; text-decoration: underline;">tarifler sayfamızdan</a> sağlıklı yemek tariflerine ulaşabilirsiniz.';
            }
        }

        // Giriş ve kayıt ile ilgili sorular
        else if (lowerMessage.includes('giriş yaptım') || lowerMessage.includes('başlamak') || lowerMessage.includes('ne yapmalıyım') || lowerMessage.includes('üye oldum')) {
            return 'Hoş geldiniz! Başlamak için öncelikle <a href="profile.html" target="_blank" style="color: #007bff; text-decoration: underline;">profil sayfanızı</a> ziyaret edip bilgilerinizi doldurmanızı öneririm. Bu sayede size özel programlar oluşturabiliriz.<br><br>İsterseniz şunları yazarak devam edebilirsiniz:<br>- "Kilo vermek için antrenman programı arıyorum"<br>- "Kas kazanma antrenman programı istiyorum"<br>- "Antrenman programı oluşturmak istiyorum"<br>- "Kilo vermek için beslenme programı arıyorum"';
        }
        else if (lowerMessage.includes('kayıt') || lowerMessage.includes('üye ol')) {
            return 'Üye olmak için <a href="kayitol.html" target="_blank" style="color: #007bff; text-decoration: underline;">kayıt sayfamızı</a> ziyaret edebilirsiniz. Kayıt olduktan sonra size özel fitness programlarına erişebilirsiniz.';
        }
        else if (lowerMessage.includes('giriş') || lowerMessage.includes('login')) {
            return 'Giriş yapmak için <a href="giris.html" target="_blank" style="color: #007bff; text-decoration: underline;">giriş sayfamızı</a> ziyaret edebilirsiniz.';
        }

        // Program ve egzersiz ile ilgili sorular
        else if (lowerMessage.includes('egzersiz') || lowerMessage.includes('antrenman')) {
            return 'Size özel egzersiz programları için <a href="egzersizler.html" target="_blank" style="color: #007bff; text-decoration: underline;">egzersizler sayfamızı</a> ziyaret edebilirsiniz. Ayrıca <a href="programlar.html" target="_blank" style="color: #007bff; text-decoration: underline;">programlar sayfamızda</a> hazır programlar da bulabilirsiniz.';
        }
        else if (lowerMessage.includes('haftalık') || lowerMessage.includes('program')) {
            return 'Haftalık antrenman programınızı <a href="haftalik-plan.html" target="_blank" style="color: #007bff; text-decoration: underline;">haftalık plan sayfamızda</a> oluşturabilirsiniz.';
        }

        // Beslenme ile ilgili sorular
        else if (lowerMessage.includes('beslenme') || lowerMessage.includes('diyet')) {
            return 'Sağlıklı beslenme önerileri ve tarifler için <a href="beslenme.html" target="_blank" style="color: #007bff; text-decoration: underline;">beslenme sayfamızı</a> ziyaret edebilirsiniz. Kalori ihtiyacınızı hesaplamak için <a href="kalori-hesaplama.html" target="_blank" style="color: #007bff; text-decoration: underline;">kalori hesaplama aracımızı</a> kullanabilirsiniz.';
        }
        else if (lowerMessage.includes('tarif') || lowerMessage.includes('yemek')) {
            return 'Sağlıklı ve fitness dostu tarifler için <a href="tarifler.html" target="_blank" style="color: #007bff; text-decoration: underline;">tarifler sayfamızı</a> ziyaret edebilirsiniz.';
        }

        // Hedef odaklı sorular
        else if (lowerMessage.includes('kas') || lowerMessage.includes('güç')) {
            return 'Kas kazanma programları ve beslenme önerileri için <a href="kas-kazanma.html" target="_blank" style="color: #007bff; text-decoration: underline;">kas kazanma sayfamızı</a> ziyaret edebilirsiniz.';
        }

        // Topluluk ve iletişim
        else if (lowerMessage.includes('topluluk') || lowerMessage.includes('sorular')) {
            return 'Diğer üyelerle etkileşime geçmek ve sorularınızı sormak için <a href="topluluk.html" target="_blank" style="color: #007bff; text-decoration: underline;">topluluk sayfamızı</a> ziyaret edebilirsiniz.';
        }
        else if (lowerMessage.includes('iletişim') || lowerMessage.includes('destek')) {
            return 'Bizimle iletişime geçmek için <a href="iletisim.html" target="_blank" style="color: #007bff; text-decoration: underline;">iletişim sayfamızı</a> ziyaret edebilirsiniz.';
        }

        // Genel selamlaşma
        else if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam')) {
            return 'Merhaba! Ben spor asistanınızım. Size nasıl yardımcı olabilirim? Programlar, beslenme, egzersizler veya diğer konularda bilgi almak için sorabilirsiniz.';
        }
        else if (lowerMessage.includes('teşekkür') || lowerMessage.includes('sağol')) {
            return 'Rica ederim! Başka bir sorunuz varsa yardımcı olmaktan mutluluk duyarım.';
        }
        else {
            return 'Üzgünüm, bu konuda size yardımcı olamıyorum. Lütfen başka bir soru sorun veya <a href="iletisim.html" target="_blank" style="color: #007bff; text-decoration: underline;">iletişim sayfamızdan</a> bize ulaşın.';
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