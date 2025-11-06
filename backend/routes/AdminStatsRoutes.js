const { getAdminStats } = require('../controllers/AdminStatsController');
const verifyToken = require('../middlewares/VerifyToken');

const router = require('express').Router();


// You might also have a verifyAdmin middleware to add here

// GET /api/admin/stats
router.get('/admin/stats', verifyToken, getAdminStats);

module.exports = router;
