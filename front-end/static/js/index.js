import { addLoadingToElement, addLoadingFailed } from './utils.js';
import { getAllRecipes } from './api.js';


function generateHTMLForRecipePreview(recipe) {
    return `
        <a href="./detail.html?id=${recipe.id}">
            <div class="recipe-preview">
                <img src="./static/media/images/plate.png">
                <div>
                    <h3>${recipe.title}</h3>
                    <div class="subtitle">
                        <p>${recipe.servings}p |</p>
                        <p>${recipe.cookingTime}min |</p>
                        <p>${recipe.category}</p>
                    </div>
                </div>
            </div>
        </a>
    `
}

function addHTMLToRecipesPreview(recipes) {
    // Fetch the DOM element
    const $recipesPreviewElement = document.querySelector('.recipes-preview');

    // Generate content
    const recipesHTML = recipes.map(recipe => {
        return generateHTMLForRecipePreview(recipe);
    }).join('');

    // Add content to the DOM element
    $recipesPreviewElement.innerHTML = recipesHTML;
}


// ———————————————————————————————————————————————————————————————————————————

async function loadAllRecipes() {
    addLoadingToElement('.recipes-preview')
    await getAllRecipes(addHTMLToRecipesPreview, '.recipes-preview')
}


async function init() {
    try {
        await loadAllRecipes();
    } catch (error) {
        addLoadingFailed(error)
    }
}

init();

