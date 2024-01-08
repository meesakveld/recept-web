import { addLoadingToElement, addLoadingFailed } from './utils.js';
import { getAllRecipes, getCategories, getDifficulties, getIngredients } from './api.js';


function generateHTMLForRecipePreview(recipe) {
    return `
        <a href="./detail.html?id=${recipe.id}">
            <div class="recipe-preview">
                <img src="./static/media/images/plate.png">
                <div>
                    <h3>${recipe.title}</h3>
                    <div class="subtitle">
                        <p>${recipe.servings} |</p>
                        <p>${recipe.cookingTime} |</p>
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

function addHTMLForCategorieOptions(categories) {
    const html = categories.map(category => {
        return `
        <input type="radio" , id="${category}" , name="category">
        <label for="${category}">${category}</label><br>
    `
    }).join('');

    const $categoryFormElement = document.querySelector('#form__category');
    $categoryFormElement.innerHTML = html;
}

async function loadRecipesForCategory(category) {
    await getAllRecipes((recipes) => {
        const filteredRecipes = recipes.filter((recipe) => recipe.category === category);
        addHTMLToRecipesPreview(filteredRecipes);
    })
}

function generateHTMLForLi(array) {
    return array.map((item) => {
        return `<li>${item}</li>`
    }).join('');
}

async function checkSelectedCategory() {
    const $categoryFormElements = document.querySelectorAll('.filter-section input');
    $categoryFormElements.forEach((elem) => {
        elem.addEventListener('click', async (event) => {
            const id = event.target.id;
            if (id === "") {
                addLoadingToElement('.recipes-preview')
                await loadAllRecipes();
                return;
            }
            addLoadingToElement('.recipes-preview')
            await loadRecipesForCategory(event.target.id);
        })
    })
}

function generateHTMLForPopup(title, data) {
    const html = `
    <div class="flex">
        <h2>${title}</h2>
        <button class="close-btn">X</button>
    </div>
    <ul>
        ${generateHTMLForLi(data)}
    </ul>
    `
    return html;
}

function activatePopup() {
    const $popupContainerElement = document.querySelector('.popup__container');
    const $bodyElement = document.querySelector('body');

    $popupContainerElement.classList.add('open');
    $bodyElement.classList.add('open');

    $popupContainerElement.addEventListener('click', () => {
        $popupContainerElement.classList.remove('open');
        $bodyElement.classList.remove('open');
    })
}

function addContentToPopup(html) {
    const $popupElement = document.querySelector('.popup');
    $popupElement.innerHTML = html;
}


// ———————————————————————————————————————————————————————————————————————————

function addLoading() {
    addLoadingToElement('#form__category')
    addLoadingToElement('.recipes-preview')
}

async function loadAllRecipes() {
    await getAllRecipes(addHTMLToRecipesPreview);
}

async function loadAllCategories() {
    await getCategories((data) => {
        addHTMLForCategorieOptions(data)
        checkSelectedCategory()
    });
}

async function loadPopup() {
    const $popupButtonElements = document.querySelectorAll('.popup-btn');
    $popupButtonElements.forEach((elem) => {
        elem.addEventListener('click', async (ev) => {
            const classList = ev.target.classList;
            activatePopup();
            addLoadingToElement('.popup')
            if (classList.contains('ingredients')) {
                await getIngredients((data) => {
                    addContentToPopup(generateHTMLForPopup('Ingredients', data));
                })
            } else if (classList.contains('difficulty')) {
                await getDifficulties((data) => {
                    addContentToPopup(generateHTMLForPopup('Difficulty levels', data));
                })
            }
        })
    })
}


async function init() {
    try {
        addLoading()
        await loadAllRecipes();
        await loadAllCategories();
        await loadPopup();
    } catch (error) {
        addLoadingFailed(error)
    }
}

init();

