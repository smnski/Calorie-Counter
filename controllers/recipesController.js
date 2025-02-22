const Recipe = require('../models/Recipe');
const Day = require("../models/Day");

const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.render('recipes', { recipes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching recipes');
  }
};

const addRecipe = async (req, res) => {
  try {
    const { name, calories, protein, carbohydrates, fats } = req.body;
    const newRecipe = new Recipe({ name, calories, protein, carbohydrates, fats });
    await newRecipe.save();
    req.io.emit('recipeAdded', newRecipe);
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error adding recipe' });
  }
};

const deleteRecipe = async (req, res) => {
  try {
    const { recipeId } = req.body;
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    if (deletedRecipe) {
      res.json({ message: 'Recipe deleted successfully' });
      req.io.emit('recipeRemoved', recipeId);
      try {
        const response = await fetch("http://localhost:3000/recipes/deleteManyById", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deletedRecipe })
        });
        const result = await response.json();
      } catch (err) {
        console.error(err);
      }
    } else {
      res.status(404).json({ message: 'Recipe not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting recipe' });
  }
};

const updateRecipe = async (req, res) => {
  try {
    const { name, calories, protein, carbohydrates, fats } = req.body;
    const recipeId = req.params.id;
    const editedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      { name, calories, protein, carbohydrates, fats },
      { new: true }
    );
    if (!editedRecipe) {
      return res.status(404).json({ success: false, message: "Recipe not found" });
    }
    const daysToUpdate = await Day.find({ "meals.recipe": recipeId });
    for (const day of daysToUpdate) {
      let newCalories = 0;
      let newProtein = 0;
      let newCarbohydrates = 0;
      let newFats = 0;
      for (const meal of day.meals) {
        if (meal.recipe.equals(recipeId)) {
          newCalories += editedRecipe.calories;
          newProtein += editedRecipe.protein;
          newCarbohydrates += editedRecipe.carbohydrates;
          newFats += editedRecipe.fats;
        } else {
          const existingRecipe = await Recipe.findById(meal.recipe);
          if (existingRecipe) {
            newCalories += existingRecipe.calories;
            newProtein += existingRecipe.protein;
            newCarbohydrates += existingRecipe.carbohydrates;
            newFats += existingRecipe.fats;
          }
        }
      }
      await Day.findByIdAndUpdate(day._id, {
        consumedCalories: newCalories,
        consumedProtein: newProtein,
        consumedCarbohydrates: newCarbohydrates,
        consumedFats: newFats,
      });
    }
    res.status(200).json({ success: true });
    req.io.emit("recipeEdited", editedRecipe);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating recipe');
  }
};

const filterRecipes = async (req, res) => {
  try {
    const { recipeName, minCalories, maxCalories, minProtein, maxProtein, minCarbs, maxCarbs, minFats, maxFats } = req.query;
    const filter = {};
    if (recipeName) {
      filter.name = { $regex: recipeName, $options: 'i' };
    }
    if (minCalories) filter.calories = { ...filter.calories, $gte: Number(minCalories) };
    if (maxCalories) filter.calories = { ...filter.calories, $lte: Number(maxCalories) };
    if (minProtein) filter.protein = { ...filter.protein, $gte: Number(minProtein) };
    if (maxProtein) filter.protein = { ...filter.protein, $lte: Number(maxProtein) };
    if (minCarbs) filter.carbohydrates = { ...filter.carbohydrates, $gte: Number(minCarbs) };
    if (maxCarbs) filter.carbohydrates = { ...filter.carbohydrates, $lte: Number(maxCarbs) };
    if (minFats) filter.fats = { ...filter.fats, $gte: Number(minFats) };
    if (maxFats) filter.fats = { ...filter.fats, $lte: Number(maxFats) };
    const filteredRecipes = await Recipe.find(filter);
    res.status(200).json({ success: true });
    req.io.emit("recipesFiltered", filteredRecipes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error filtering recipes');
  }
};

module.exports = { getRecipes, addRecipe, deleteRecipe, updateRecipe, filterRecipes };
