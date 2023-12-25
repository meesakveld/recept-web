const API_URL = 'http://localhost:1212/api/recipes/'

async function getAllRecipes(callback) {
    const response = await fetch(API_URL);
    const data = await response.json();
    callback(data);
}


async function getRecipe(id, callback) {
    const response = await fetch(API_URL + id);
    const data = await response.json();
    callback(data);
}


async function saveRecipeToServer(recipe) {
    const response = await fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(recipe),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}


async function updateRecipeToServer(recipe) {
    const response = await fetch(API_URL + recipe.id, {
        method: 'PUT',
        body: JSON.stringify(recipe),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data;
}


async function deleteRecipeFromServer(id) {
    const response = await fetch(API_URL + id, {
        method: 'DELETE'
    });
    const data = await response.json();
    return data;
}


export {
    getAllRecipes,
    getRecipe,
    saveRecipeToServer,
    updateRecipeToServer,
    deleteRecipeFromServer
}