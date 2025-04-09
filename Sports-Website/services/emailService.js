const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'ByteForce - E-posta Doğrulama',
        html: `
            <h1>ByteForce'a Hoş Geldiniz!</h1>
            <p>Hesabınızı doğrulamak için aşağıdaki bağlantıya tıklayın:</p>
            <a href="${verificationUrl}">Hesabımı Doğrula</a>
            <p>Bu bağlantı 24 saat boyunca geçerlidir.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('E-posta gönderme hatası:', error);
        return false;
    }
};

module.exports = {
    sendVerificationEmail
}; 