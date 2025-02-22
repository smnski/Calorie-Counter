const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipesController');
const dashboardController = require('../controllers/dashboardController');

router.get('/', recipesController.getRecipes); //x
router.post('/add', recipesController.addRecipe); //x
router.delete('/delete', recipesController.deleteRecipe); //x
router.delete('/deleteManyById', dashboardController.removeMealsByRecipeId);
router.put('/edit/:id', recipesController.updateRecipe); //x
router.get('/filter', recipesController.filterRecipes); //x

module.exports = router;
