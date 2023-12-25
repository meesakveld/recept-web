const API_URL = 'https://api.api-ninjas.com/v1/recipe'
const API_KEY = 'fTafMVfPlhsPfxY1aEO9Vg==wryv4r3t86iF8JfI'

// ———————————————————————————————————————————————————————————————————————————

function addLoadingToElement(elements = []) {
    const html = () => {
        return `
            <div class="loading">
                <p>Loading...</p>
            </div>
        `   
    }

    elements.forEach(elem => {
        const $element = document.querySelector(elem);
        $element.innerHTML = html()
    })
}

function addLoadingFailed(error) {
    const mainElement = document.querySelector('main')
    mainElement.innerHTML = `
        <article class="oops">
            <h2>Oops! Something went wrong.</h2>
            <p>Reload the site and try again.</p>
            <p><strong>Error</strong>: ${error.message}</p>
        </article>
    `
}

function generateHTMLForRecipePreview(recipe) {
    return `
        <a href="./detail.html">
            <div class="recipe-preview">
                <img src="./static/media/images/plate.png">
                <div>
                    <h3>${recipe.title}</h3>
                    <p>${recipe.servings}</p>
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

async function getRecipes(query, callback = [], elements = []) {
    try {
        addLoadingToElement(elements)
        const response = await fetch(`${API_URL}?query=${query}`, {
            headers: {
                'X-Api-Key': API_KEY
            }
        });
        const data = await response.json();
        callback.forEach(item => item(data));
    } catch (error) {
        console.error(error);
        addLoadingFailed(error)
    }

}


function init() {
    getRecipes('b', [addHTMLToRecipesPreview], ['.recipes-preview'])
}

init();

