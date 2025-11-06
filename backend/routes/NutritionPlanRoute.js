const { createNutritionPlan, getMyEnrolledClients, getNutritionPlans } = require('../controllers/nutritionPlanController');
const { fileUpload } = require('../middlewares/FileUploader');
const verifyToken = require('../middlewares/VerifyToken');

const router = require('express').Router();

router.post('/nutrion-plan',verifyToken,fileUpload.single('foodImage'),createNutritionPlan);
// ✅ --- ADD THIS NEW GET ROUTE ---
// This is the new endpoint for the searchable dropdown
router.get('/my-clients', verifyToken, getMyEnrolledClients);
router.get('/nutrition-plans', verifyToken,getNutritionPlans);

module.exports = router;