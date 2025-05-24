const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'ByteForce - E-posta Doğrulama',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">ByteForce'a Hoş Geldiniz!</h2>
                <p>Hesabınızı doğrulamak için aşağıdaki bağlantıya tıklayın:</p>
                <a href="${verificationUrl}" 
                   style="display: inline-block; 
                          background-color: #4CAF50; 
                          color: white; 
                          padding: 12px 24px; 
                          text-decoration: none; 
                          border-radius: 4px; 
                          margin: 16px 0;">
                    E-posta Adresimi Doğrula
                </a>
                <p>Bu bağlantı 24 saat boyunca geçerlidir.</p>
                <p>Eğer bu hesabı siz oluşturmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    Bu e-posta ByteForce spor ve fitness platformu tarafından gönderilmiştir.
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Doğrulama e-postası gönderildi: ${email}`);
    } catch (error) {
        console.error('E-posta gönderme hatası:', error);
        throw new Error('E-posta gönderilemedi');
    }
};

const sendPasswordResetEmail = async (email, token) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'ByteForce - Şifre Sıfırlama',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Şifre Sıfırlama İsteği</h2>
                <p>Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın:</p>
                <a href="${resetUrl}" 
                   style="display: inline-block; 
                          background-color: #4CAF50; 
                          color: white; 
                          padding: 12px 24px; 
                          text-decoration: none; 
                          border-radius: 4px; 
                          margin: 16px 0;">
                    Şifremi Sıfırla
                </a>
                <p>Bu bağlantı 1 saat boyunca geçerlidir.</p>
                <p>Eğer şifre sıfırlama talebinde bulunmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #666; font-size: 12px;">
                    Bu e-posta ByteForce spor ve fitness platformu tarafından gönderilmiştir.
                </p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Şifre sıfırlama e-postası gönderildi: ${email}`);
    } catch (error) {
        console.error('E-posta gönderme hatası:', error);
        throw new Error('E-posta gönderilemedi');
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
}; 