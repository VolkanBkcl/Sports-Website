const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstName: {
        type: String,
        required: false,
        trim: true
    },
    lastName: {
        type: String,
        required: false,
        trim: true
    },
    profile: {
        fullname: String,
        phone: String,
        birthdate: Date,
        gender: {
            type: String,
            enum: ['male', 'female', 'other']
        },
        address: String,
        city: String,
        district: String,
        photoUrl: String,
        age: Number,
        height: Number,
        weight: Number,
        fitnessGoals: [String],
        activityLevel: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Şifreyi hashleme middleware'i
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
    return bcrypt.compare(candidatePassword, this.password);
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