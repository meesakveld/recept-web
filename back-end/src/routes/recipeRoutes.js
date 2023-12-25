const express = require('express');
const router = express.Router();

const recipeController = require('../controllers/recipeController');

router.get('/recipes', recipeController.getRecipes)
router.get('/recipes/:id', recipeController.getRecipe)
router.post('/recipes', recipeController.addRecipe)
router.put('/recipes/:id', recipeController.editRecipe)
router.delete('/recipes/:id', recipeController.deleteRecipe)

module.exports = router;