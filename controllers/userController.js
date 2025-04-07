const User = require('../models/User');
const { sendVerificationEmail } = require('../services/emailService');
const jwt = require('jsonwebtoken');

// Kayıt işlemi
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Kullanıcı var mı kontrol et
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Bu e-posta adresi zaten kullanımda' });
        }

        // Yeni kullanıcı oluştur
        const user = new User({
            email,
            password,
            firstName,
            lastName
        });

        // Doğrulama token'ı oluştur
        const verificationToken = user.createVerificationToken();
        await user.save();

        // Doğrulama e-postası gönder
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({
            message: 'Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.'
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// E-posta doğrulama
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await User.findOne({
            verificationToken: token,
            verificationTokenExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Geçersiz veya süresi dolmuş doğrulama bağlantısı' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'E-posta adresiniz başarıyla doğrulandı' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Giriş işlemi
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // E-posta ve şifre kontrolü
        if (!email || !password) {
            return res.status(400).json({ message: 'E-posta ve şifre gereklidir' });
        }

        // Kullanıcıyı bul
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
        }

        // Şifreyi kontrol et
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
        }

        // E-posta doğrulaması kontrol et
        if (!user.isVerified) {
            // Test için doğrulama kontrolünü atla
            user.isVerified = true;
            await user.save();
        }

        // JWT token oluştur
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            message: 'Sunucu hatası', 
            error: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
};

// Profil güncelleme
exports.updateProfile = async (req, res) => {
    try {
        const { weight, targetWeight, height, age, gender, activityLevel, fitnessGoals } = req.body;
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Profil bilgilerini güncelle
        user.profile = {
            ...user.profile,
            weight,
            targetWeight,
            height,
            age,
            gender,
            activityLevel,
            fitnessGoals
        };

        await user.save();

        res.status(200).json({
            message: 'Profil başarıyla güncellendi',
            profile: user.profile
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Profil bilgilerini getir
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('profile');
        
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        res.status(200).json({ profile: user.profile });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Mevcut kullanıcı bilgilerini getir
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
}; 