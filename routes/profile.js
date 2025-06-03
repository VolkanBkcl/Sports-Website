const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Profil bilgilerini getir
router.get('/me', auth, async (req, res) => {
    try {
        console.log('Profil bilgileri isteği alındı, kullanıcı ID:', req.user.id);
        
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            console.log('Kullanıcı bulunamadı:', req.user.id);
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        console.log('Kullanıcı bulundu:', user.username);
        res.json(user);
    } catch (error) {
        console.error('Profil bilgileri getirme hatası:', error);
        res.status(500).json({ 
            message: 'Sunucu hatası',
            error: error.message 
        });
    }
});

// Profil tamamlama durumunu kontrol et
router.get('/check-profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }
        res.json({ isProfileComplete: user.isProfileComplete });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Profil bilgilerini güncelle
router.put('/profile', auth, async (req, res) => {
    try {
        const {
            username,
            email,
            currentPassword,
            newPassword,
            profile
        } = req.body;

        // Kullanıcıyı bul
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
        }

        // Kullanıcı adı güncelleme
        if (username && username !== user.username) {
            const usernameExists = await User.findOne({ username });
            if (usernameExists) {
                return res.status(400).json({ message: 'Bu kullanıcı adı zaten kullanılıyor' });
            }
            user.username = username;
        }

        // Email güncelleme
        if (email && email !== user.email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ message: 'Bu email adresi zaten kullanılıyor' });
            }
            user.email = email;
        }

        // Şifre güncelleme
        if (currentPassword && newPassword) {
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ message: 'Mevcut şifre yanlış' });
            }
            user.password = newPassword;
        }

        // Profil bilgilerini güncelle
        if (profile) {
            // Zorunlu alanları kontrol et
            const requiredFields = ['fullname', 'phone', 'birthdate', 'gender', 'address', 'city', 'district'];
            const missingFields = requiredFields.filter(field => !profile[field]);
            
            if (missingFields.length > 0) {
                return res.status(400).json({ 
                    message: 'Lütfen tüm zorunlu alanları doldurun',
                    missingFields 
                });
            }

            // Mevcut profil bilgilerini koru ve yeni bilgileri ekle
            user.profile = {
                ...user.profile,
                ...profile
            };

            // Profil tamamlama durumunu güncelle
            user.isProfileComplete = true;
        }

        // Değişiklikleri kaydet
        await user.save();

        // Güncellenmiş kullanıcı bilgilerini döndür (şifre hariç)
        const updatedUser = await User.findById(user._id).select('-password');
        res.json(updatedUser);
    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

module.exports = router; 