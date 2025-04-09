const ExerciseProgram = require('../models/ExerciseProgram');
const NutritionProgram = require('../models/NutritionProgram');

// Egzersiz programı oluşturma
exports.createExerciseProgram = async (req, res) => {
    try {
        const { goal, level, duration } = req.body;
        const userId = req.user.userId;

        // Kullanıcının hedefine ve seviyesine göre program oluştur
        const program = new ExerciseProgram({
            userId,
            goal,
            level,
            duration,
            exercises: [], // Bu kısım daha sonra doldurulacak
            schedule: [] // Bu kısım daha sonra doldurulacak
        });

        await program.save();

        res.status(201).json({
            message: 'Egzersiz programı başarıyla oluşturuldu',
            program
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Beslenme programı oluşturma
exports.createNutritionProgram = async (req, res) => {
    try {
        const { goal, dailyCalories, macronutrients, restrictions } = req.body;
        const userId = req.user.userId;

        const program = new NutritionProgram({
            userId,
            goal,
            dailyCalories,
            macronutrients,
            restrictions,
            meals: [] // Bu kısım daha sonra doldurulacak
        });

        await program.save();

        res.status(201).json({
            message: 'Beslenme programı başarıyla oluşturuldu',
            program
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Egzersiz programı güncelleme
exports.updateExerciseProgram = async (req, res) => {
    try {
        const { programId } = req.params;
        const updates = req.body;

        const program = await ExerciseProgram.findByIdAndUpdate(
            programId,
            updates,
            { new: true }
        );

        if (!program) {
            return res.status(404).json({ message: 'Program bulunamadı' });
        }

        res.status(200).json({
            message: 'Program başarıyla güncellendi',
            program
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Beslenme programı güncelleme
exports.updateNutritionProgram = async (req, res) => {
    try {
        const { programId } = req.params;
        const updates = req.body;

        const program = await NutritionProgram.findByIdAndUpdate(
            programId,
            updates,
            { new: true }
        );

        if (!program) {
            return res.status(404).json({ message: 'Program bulunamadı' });
        }

        res.status(200).json({
            message: 'Program başarıyla güncellendi',
            program
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Program ilerlemesini kaydetme
exports.saveProgress = async (req, res) => {
    try {
        const { programId, type } = req.params;
        const progressData = req.body;

        let program;
        if (type === 'exercise') {
            program = await ExerciseProgram.findById(programId);
            program.progress.push(progressData);
        } else if (type === 'nutrition') {
            program = await NutritionProgram.findById(programId);
            program.progress.push(progressData);
        }

        await program.save();

        res.status(200).json({
            message: 'İlerleme başarıyla kaydedildi',
            progress: program.progress
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
}; 