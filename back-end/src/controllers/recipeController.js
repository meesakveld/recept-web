const path = require('path');
const { writeToFile, readFile } = require('../utils/file-manager');
const { RandomUUID } = require('../utils/helpers');

const recipesFilePath = path.join(__dirname, "..", "data", "recipes.json")



async function getRecipes(request, response) {
    try {
        let recipes = await readFile(recipesFilePath);
        const search = request.query.query;
        if (search) {
            recipes = recipes.filter((recipe) => recipe.title.toLowerCase().includes(search.toLowerCase()) || recipe.ingredients.map((ingredient) => ingredient.name.toLowerCase()).includes(search.toLowerCase()))
        }
        response.json(recipes)
    } catch (error) {
        response.status(500).json({
            error: error.message
        })
    }
}

async function getRecipe(request, response) {
    try {
        const { id } = request.params;
        const recipes = await readFile(recipesFilePath);
        let recipe = recipes.find((recipe) => recipe.id === id);
        
        if (recipe) {
            response.json(recipe)
        } else {
            response.status(500).json({
                error: `Recipe with id: ${id} not found`
            })
            return;
        }

    } catch (error) {
        response.status(500).json({
            error: error.message
        })
    }
}

async function getCategories(request, response) {
    try {
        const recipes = await readFile(recipesFilePath);
        const categories = recipes.map((recipe) => recipe.category);
        const uniqueCategories = [];
        categories.forEach((category) => {
            if (!uniqueCategories.includes(category)) {
                uniqueCategories.push(category)
            }
        })
        response.json(uniqueCategories)
    } catch (error) {
        response.status(500).json({
            error: error.message
        })
    }
}

async function getRecipesByCategory(request, response) {
    try {
        const { category } = request.params;
        const recipes = await readFile(recipesFilePath);

        // Check if recipe exists
        const categories = recipes.map((recipe) => recipe.category);
        if (!categories.includes(category)) {
            response.status(500).json({
                error: `Category with name: ${category} not found`
            })
            return;
        }

        const recipesByCategory = recipes.filter((recipe) => recipe.category === category);
        response.json(recipesByCategory)
    } catch (error) {
        response.status(500).json({
            error: error.message
        })
    }
}

async function getDifficulties(request, response) {
    try {
        const recipes = await readFile(recipesFilePath);
        const difficulties = recipes.map((recipe) => recipe.difficulty);
        const uniqueDifficulties = [];
        difficulties.forEach((difficulty) => {
            if (!uniqueDifficulties.includes(difficulty)) {
                uniqueDifficulties.push(difficulty)
            }
        }
        )
        response.json(uniqueDifficulties)
    } catch (error) {
        response.status(500).json({
            error: error.message
        })
    }
}

async function getIngredients(request, response) {
    try {
        const recipes = await readFile(recipesFilePath);
        const ingredients = recipes.map((recipe) => recipe.ingredients).flat().map((ingredient) => ingredient.name);
        const uniqueIngredients = [];
        ingredients.forEach((ingredient) => {
            if (!uniqueIngredients.includes(ingredient)) {
                uniqueIngredients.push(ingredient)
            }
        })
        response.json(uniqueIngredients)
    } catch (error) {
        response.status(500).json({
            error: error.message
        })
    }
}

async function addRecipe(request, response) {
    console.log(request.body);
    try {
        const recipes = await readFile(recipesFilePath);
        const randomId = RandomUUID()
        recipes.push({
            ...request.body,
            id: randomId
        })

        await writeToFile(recipesFilePath, recipes);
        response.send({
            ...request.body,
            id: randomId
        })
    } catch (error) {
        response.status(500).json({
            error: error.message
        })
    }
}

async function editRecipe(request, response) {
    try {
        const { id } = request.params;

        // 1. Recipes ophalen uit bestand
        const recipes = await readFile(recipesFilePath);

        // 2. Recipe vinden met id
        let recipe = recipes.find((recipe) => recipe.id === id);
        let index = recipes.indexOf(recipe);

        // 3. Recipe uit recipes bestand aanpassen
        recipe = request.body
        recipes[index] = recipe;

        // 4. Recipes terug schrijven naar bestand
        await writeToFile(recipesFilePath, recipes);

        // 5. Response terug sturen
        response.send(recipe)
    } catch (error) {
        response.status(500).json({
            error: error.message
        })
    }
}

async function deleteRecipe(request, response) {
    try {
        const { id } = request.params;

        // 1. Recipes ophalen uit bestand
        const recipes = await readFile(recipesFilePath);

        // 2. Recipe vinden met id
        let recipe = recipes.find((recipe) => recipe.id === id);

        // 3. Recipe uit recipes bestand verwijderen
        recipes.splice(recipes.indexOf(recipe), 1);

        // 4. Recipes terug schrijven naar bestand
        await writeToFile(recipesFilePath, recipes);

        // 5. Response terug sturen
        response.send(`Recipe deleted with id: ${id}`)
    } catch (error) {
        response.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    getRecipes,
    getRecipe,
    getCategories,
    getRecipesByCategory,
    getDifficulties,
    getIngredients,
    addRecipe,
    editRecipe,
    deleteRecipe
}
