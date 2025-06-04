const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    createdAt: { type: Date, default: Date.now }
});

const Exercise = mongoose.model('Exercise', exerciseSchema);
module.exports = Exercise; 