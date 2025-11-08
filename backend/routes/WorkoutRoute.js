const { createWorkoutPlan, getWorkoutPlans, getWorkoutPlanById } = require('../controllers/WorkoutController');
const { fileUpload } = require('../middlewares/FileUploader');
const verifyToken = require('../middlewares/VerifyToken');

const router = require('express').Router();

router.post('/create-workout',verifyToken,fileUpload.single('workoutImage'),createWorkoutPlan);
router.get('/workout-plans', verifyToken, getWorkoutPlans);
router.get('/workoutPlanById/:planId',verifyToken, getWorkoutPlanById);

module.exports = router;