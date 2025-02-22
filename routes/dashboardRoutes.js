const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/', dashboardController.getDashboardData);
router.post('/add', dashboardController.addRecipeToDay);
router.delete('/remove', dashboardController.removeMealFromDay);

module.exports = router;
