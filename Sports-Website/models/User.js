const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email gereklidir'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Şifre gereklidir'],
        minlength: [6, 'Şifre en az 6 karakter olmalıdır']
    },
    firstName: {
        type: String,
        required: [true, 'Ad gereklidir']
    },
    lastName: {
        type: String,
        required: [true, 'Soyad gereklidir']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    profile: {
        age: Number,
        gender: String,
        height: Number,
        weight: Number,
        fitnessGoals: [String],
        activityLevel: String
    }
}, {
    timestamps: true
});

// Şifre hashleme middleware
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Doğrulama token'ı oluşturma metodu
userSchema.methods.createVerificationToken = function() {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    this.verificationToken = verificationToken;
    this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 saat
    return verificationToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 