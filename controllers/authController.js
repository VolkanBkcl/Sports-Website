const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT token oluşturma fonksiyonu
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'gizli-anahtar', {
        expiresIn: '30d'
    });
};

// Input validasyonu
const validateRegisterInput = (username, email, password) => {
    const errors = {};
    
    if (!username || username.length < 3) {
        errors.username = 'Kullanıcı adı en az 3 karakter olmalıdır';
    }
    
    if (!email || !email.includes('@')) {
        errors.email = 'Geçerli bir email adresi giriniz';
    }
    
    if (!password || password.length < 6) {
        errors.password = 'Şifre en az 6 karakter olmalıdır';
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

// Kullanıcı kayıt işlemi
exports.register = async (req, res) => {
    try {
        const { username, email, password, firstName, lastName } = req.body;

        // Input validasyonu
        const { isValid, errors } = validateRegisterInput(username, email, password);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                errors
            });
        }

        // Email ve kullanıcı adının benzersiz olduğunu kontrol et
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Bu email veya kullanıcı adı zaten kullanımda'
            });
        }

        // Yeni kullanıcı oluştur
        const user = new User({
            username,
            email,
            password,
            firstName,
            lastName
        });

        await user.save();

        // Token oluştur
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Kayıt işlemi sırasında bir hata oluştu',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Kullanıcı giriş işlemi
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email ve şifre gereklidir'
            });
        }

        // Kullanıcıyı bul
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz email veya şifre'
            });
        }

        // Şifreyi kontrol et
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Geçersiz email veya şifre'
            });
        }

        // Token oluştur
        const token = generateToken(user._id);

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        console.error('Giriş hatası:', error);
        res.status(500).json({
            success: false,
            message: 'Giriş işlemi sırasında bir hata oluştu',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}; 