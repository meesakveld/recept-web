const path = require('path');
const { writeToFile, readFile } = require('../utils/file-manager');
const { RandomUUID } = require('../utils/helpers');

const recipesFilePath = path.join(__dirname, "..", "data", "recipes.json")



async function getRecipes(request, response) {
    try {
        const recipes = await readFile(recipesFilePath);
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
        response.send(`New recipe with title \"${request.body.title}\" is added with id: ${randomId}`)
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

        // 3. Recipe uit recipes bestand aanpassen
        recipe.title = request.body.title;

        // 4. Recipes terug schrijven naar bestand
        await writeToFile(recipesFilePath, recipes);

        // 5. Response terug sturen
        response.send(`Recipe updated with id: ${id}`)
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
    addRecipe,
    editRecipe,
    deleteRecipe
}
