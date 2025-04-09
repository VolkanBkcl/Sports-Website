const mongoose = require('mongoose');

const nutritionProgramSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    goal: {
        type: String,
        enum: ['weight_loss', 'muscle_gain', 'maintenance'],
        required: true
    },
    dailyCalories: {
        type: Number,
        required: true
    },
    macronutrients: {
        protein: {
            type: Number,
            required: true
        },
        carbohydrates: {
            type: Number,
            required: true
        },
        fats: {
            type: Number,
            required: true
        }
    },
    meals: [{
        name: {
            type: String,
            enum: ['breakfast', 'lunch', 'dinner', 'snack'],
            required: true
        },
        time: String,
        foods: [{
            name: String,
            quantity: Number,
            unit: String,
            calories: Number,
            protein: Number,
            carbs: Number,
            fats: Number
        }]
    }],
    restrictions: [{
        type: String,
        enum: ['vegetarian', 'vegan', 'gluten-free', 'lactose-free', 'none']
    }],
    progress: [{
        date: Date,
        mealsConsumed: [{
            mealId: {
                type: mongoose.Schema.Types.ObjectId
            },
            foods: [{
                name: String,
                quantity: Number,
                unit: String
            }],
            notes: String
        }],
        totalCalories: Number,
        totalProtein: Number,
        totalCarbs: Number,
        totalFats: Number
    }]
}, {
    timestamps: true
});

const NutritionProgram = mongoose.model('NutritionProgram', nutritionProgramSchema);

module.exports = NutritionProgram; 