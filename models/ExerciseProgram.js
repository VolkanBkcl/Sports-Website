const mongoose = require('mongoose');

const exerciseProgramSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    goal: {
        type: String,
        enum: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility'],
        required: true
    },
    level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    duration: {
        type: Number, // Hafta sayısı
        required: true
    },
    exercises: [{
        name: String,
        sets: Number,
        reps: Number,
        restTime: Number, // Saniye cinsinden
        description: String,
        videoUrl: String
    }],
    schedule: [{
        day: {
            type: String,
            enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        },
        exercises: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercise'
        }]
    }],
    progress: [{
        date: Date,
        completedExercises: [{
            exerciseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Exercise'
            },
            setsCompleted: Number,
            repsCompleted: Number,
            notes: String
        }]
    }]
}, {
    timestamps: true
});

const ExerciseProgram = mongoose.model('ExerciseProgram', exerciseProgramSchema);

module.exports = ExerciseProgram; 