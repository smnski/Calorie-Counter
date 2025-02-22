const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    trim: true,
  },
  consumedCalories: {
    type: Number,
    default: 0,
    min: 0,
  },
  consumedProtein: {
    type: Number,
    default: 0,
    min: 0,
  },
  consumedFats: {
    type: Number,
    default: 0,
    min: 0,
  },
  consumedCarbohydrates: {
    type: Number,
    default: 0,
    min: 0,
  },
  meals: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() }, // Unique ID for each meal instance
      recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    },
  ],
});

module.exports = mongoose.models.Day || mongoose.model('Day', daySchema);
