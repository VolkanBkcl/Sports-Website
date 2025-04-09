const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');
const auth = require('../middleware/auth');

// Program oluşturma route'ları
router.post('/exercise', auth, programController.createExerciseProgram);
router.post('/nutrition', auth, programController.createNutritionProgram);

// Program güncelleme route'ları
router.put('/exercise/:programId', auth, programController.updateExerciseProgram);
router.put('/nutrition/:programId', auth, programController.updateNutritionProgram);

// İlerleme kaydetme route'ları
router.post('/progress/:type/:programId', auth, programController.saveProgress);

module.exports = router; 