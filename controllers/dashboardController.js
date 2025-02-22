const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
const Day = require('../models/Day');

const getDashboardData = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    const today = new Date().setHours(0, 0, 0, 0);
    let dayRecord = await Day.findOne({ date: today }).populate('meals.recipe');
    res.render('dashboard', {
      recipes: recipes,
      dayRecord: dayRecord || {},
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).send('Error fetching dashboard data');
  }
};

const addRecipeToDay = async (req, res) => {
  const { recipeId } = req.body;
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    let dayRecord = await Day.findOne({ date: today });
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ success: false, message: 'Recipe not found' });
    }
    const newMeal = {
      _id: new mongoose.Types.ObjectId(),
      recipe: recipeId,
    };
    if (!dayRecord) {
      dayRecord = new Day({
        date: today,
        meals: [newMeal],
        consumedCalories: recipe.calories,
        consumedProtein: recipe.protein,
        consumedCarbohydrates: recipe.carbohydrates,
        consumedFats: recipe.fats,
      });
    } else {
      dayRecord.meals.push(newMeal);
      dayRecord.consumedCalories += recipe.calories;
      dayRecord.consumedProtein += recipe.protein;
      dayRecord.consumedCarbohydrates += recipe.carbohydrates;
      dayRecord.consumedFats += recipe.fats;
    }
    await dayRecord.save();
    const updatedDayRecord = await Day.findOne({ date: today }).populate('meals.recipe');
    req.io.emit('mealAdded', updatedDayRecord);
    res.status(200).json({ success: true, message: 'Recipe added successfully', dayRecord: updatedDayRecord });
  } catch (err) {
    console.error('Error adding recipe to day:', err);
    res.status(500).json({ success: false, message: 'Error adding recipe' });
  }
};

const removeMealsByRecipeId = async (req, res) => {
  const { deletedRecipe } = req.body;
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    let dayRecord = await Day.findOne({ date: today });
    if (!dayRecord) {
      return res.status(404).json({ success: true, message: 'No meals found for today' });
    }
    const mealsToRemove = dayRecord.meals.filter(meal => meal.recipe.toString() === deletedRecipe._id.toString());
    if (mealsToRemove.length === 0) {
      return res.status(404).json({ success: true, message: 'No meals for recipe found' });
    }
    dayRecord.meals = dayRecord.meals.filter(meal => meal.recipe.toString() !== deletedRecipe._id.toString());
    dayRecord.consumedCalories -= deletedRecipe.calories * mealsToRemove.length;
    dayRecord.consumedFats -= deletedRecipe.fats * mealsToRemove.length;
    dayRecord.consumedCarbohydrates -= deletedRecipe.carbohydrates * mealsToRemove.length;
    dayRecord.consumedProtein -= deletedRecipe.protein * mealsToRemove.length;
    await dayRecord.save();
    res.status(200).json({ success: true, message: 'Meals removed successfully' });
  } catch (err) {
    console.error('Error removing meals by recipe ID:', err);
    res.status(500).json({ success: false, message: 'Error removing meals' });
  }
};

const removeMealFromDay = async (req, res) => {
  const { mealId } = req.body;
  try {
    const today = new Date().setHours(0, 0, 0, 0);
    let dayRecord = await Day.findOne({ date: today });
    if (!dayRecord) {
      return res.status(404).json({ success: false, message: 'No meals found for today' });
    }
    const mealToRemove = dayRecord.meals.find(meal => meal._id.toString() === mealId);
    if (!mealToRemove) {
      return res.status(404).json({ success: false, message: 'Meal not found' });
    }
    dayRecord.meals = dayRecord.meals.filter(meal => meal._id.toString() !== mealId);
    const recipe = await Recipe.findById(mealToRemove.recipe);
    if (recipe) {
      dayRecord.consumedCalories -= recipe.calories;
      dayRecord.consumedProtein -= recipe.protein;
      dayRecord.consumedCarbohydrates -= recipe.carbohydrates;
      dayRecord.consumedFats -= recipe.fats;
    }
    await dayRecord.save();
    const updatedDayRecord = await Day.findOne({ date: today }).populate('meals.recipe');
    req.io.emit('mealRemoved', updatedDayRecord);
    res.status(200).json({ success: true, message: 'Meal removed successfully', dayRecord: updatedDayRecord });
  } catch (err) {
    console.error('Error removing meal from day:', err);
    res.status(500).json({ success: false, message: 'Error removing meal' });
  }
};

module.exports = { getDashboardData, addRecipeToDay, removeMealsByRecipeId, removeMealFromDay };
