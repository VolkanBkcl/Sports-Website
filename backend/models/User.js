const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Model zaten tanımlanmışsa onu döndür
if (mongoose.models.User) {
    module.exports = mongoose.models.User;
} else {
    const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true
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
        fullName: {
            type: String,
            required: true
        },
        profilePicture: {
            type: String,
            default: 'https://via.placeholder.com/150'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        role: {
            type: String,
            enum: ['user', 'premium'],
            default: 'user'
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    });

    // Şifre hashleme middleware
    userSchema.pre('save', async function(next) {
        if (this.isModified('password')) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    });

    // Şifre doğrulama metodu
    userSchema.methods.comparePassword = async function(password) {
        return await bcrypt.compare(password, this.password);
    };

    const User = mongoose.model('User', userSchema);
    module.exports = User;
} 