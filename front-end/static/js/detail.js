import { addLoadingToElement, addLoadingFailed } from './utils.js';
import { getRecipe, updateRecipeToServer, saveRecipeToServer, deleteRecipeFromServer } from './api.js';



/* ———————— Change TAG ———————— */
// P tag
function changeToInput(elements, placeholder) {
    const $elements = document.querySelectorAll(elements);
    $elements.forEach((elem) => {
        elem.outerHTML = `
            <input class="${elem.getAttribute('class')}" placeholder="${placeholder}" value="${elem.innerText}"></input>
        `
    })
}
function changeTagToPtag(elements) {
    const $elements = document.querySelectorAll(elements);
    $elements.forEach((elem) => {
        elem.outerHTML = `
            <p ${elem.getAttribute('class') !== null ? `class="${elem.getAttribute('class')}"` : ""}>${elem.getAttribute('value')}</p>
        `
    })
}

// H2 tag
function changeH2tagToInput(elements, placeholder) {
    const $elements = document.querySelectorAll(elements);
    $elements.forEach((elem) => {
        elem.outerHTML = `
            <input class="${elem.getAttribute('class')}" placeholder="${placeholder}" value="${elem.innerText}"></input>
        `
    })
}
function changeTagToH2tag(elements) {
    const $elements = document.querySelectorAll(elements);
    $elements.forEach((elem) => {
        elem.outerHTML = `
            <h2 ${elem.getAttribute('class') !== null ? `class="${elem.getAttribute('class')}"` : ""}>${elem.getAttribute('value')}</h2>
        `
    })
}

// Textarea
function changeTextAreaTagToPtag(elements) {
    const $elements = document.querySelectorAll(elements);
    $elements.forEach((elem) => {
        elem.outerHTML = `
            <p ${elem.getAttribute('class') !== null ? `class="${elem.getAttribute('class')}"` : ""}>${elem.innerHTML}</p>
        `
    })
}
function changePtagToTextArea(elements, placeholder) {
    const $elements = document.querySelectorAll(elements);
    $elements.forEach((elem) => {
        elem.outerHTML = `
            <textarea placeholder="${placeholder}">${elem.innerText}</textarea>
        `
    })
}


// ———————— General ————————

function addIngredientItem() {
    const $ingredientsElement = document.querySelector('.ingredients-items');
    const $addIngredientBtnElement = document.querySelector('.addIngredient');

    $addIngredientBtnElement.addEventListener('click', (ev) => {
        ev.preventDefault();
        $ingredientsElement.innerHTML += `
            <li>•<input class="p name" placeholder="Name" value=""><input class="p amount" placeholder="Amount" value=""></li>
        `

        updateInputValue()
    });

}

function generateListItemsForIngredients(ingredients) {
    return ingredients.map(ingredient => {
        return `
            <li>•<p class="p name">${ingredient.name}</p><p class="p amount">${ingredient.amount}</p></li>
        `
    }).join('');
}

function generateHTMLForRecipe(recipe) {
    return `
        <button class="recipe-btn edit">Edit recipe</button>
        <button class="recipe-btn save">Save recipe</button>
        <button class="recipe-btn delete">Delete recipe</button>
        
        <form>
            <h2 class="h2 title">${recipe.title}</h2>
            <div class="subtitle"><p class="p servings">${recipe.servings}</p> | <p class="p cookingtime">${recipe.cookingTime}</p> | <p class="p difficulty">${recipe.difficulty}</p> | <p class="p category">${recipe.category}</p></div>
            
            <ul class="ingredients">
                <div class=ingredients-items>
                    ${generateListItemsForIngredients(recipe.ingredients)}
                </div>
                <button class="addIngredient">Add ingredient</button>
            </ul>

            <div class="instructions">
                <p>${recipe.instructions}</p>
            </div>
        </form>
    `
}

function addRecipeToHTML(recipe) {
    const $recipeElement = document.querySelector('.recipe');
    $recipeElement.innerHTML = generateHTMLForRecipe(recipe);
}

function updateInputValue() {
    const inputElements = document.querySelectorAll('input');
    inputElements.forEach((elem) => {
        elem.addEventListener('input', () => {
            elem.setAttribute('value', elem.value)
        })
    })
}

function updateTextAreaValue() {
    const inputElements = document.querySelectorAll('textarea');
    inputElements.forEach((elem) => {
        elem.addEventListener('input', () => {
            elem.innerHTML = elem.value
        })
    })
}

function filterEmptyIngredientsItems() {
    const $nameElement = document.querySelectorAll('.ingredients-items li .name');
    const $amountElement = document.querySelectorAll('.ingredients-items li .amount');

    $nameElement.forEach((elem, index) => {
        if (elem.innerText === "" && $amountElement[index].innerText === "") {
            elem.parentElement.remove()
        }
    })
}

function combineAmoundAndName(ingredients, amounts) {
    let ingredientsArray = [];
    ingredients.forEach((elem, index) => {
        ingredientsArray.push({
            amount: (amounts[index].innerText !== "null" ? amounts[index].innerText : ""),
            name: (elem.innerText !== "null" ? elem.innerText : "")
        })
    })

    let filteredIngredients = ingredientsArray.filter((elem) => {
        return (elem.amount !== "" && elem.name !== "") || elem.amount !== "" || elem.name !== ""
    })

    return filteredIngredients
}

function returnRecipe(id, title, category, ingredients, instructions, cookingTime, difficulty, servings) {
    return {
        id: id,
        title: title,
        category: category,
        ingredients: ingredients,
        instructions: instructions,
        cookingTime: cookingTime,
        difficulty: difficulty,
        servings: servings
    }
}

function createRecipeFromInputFields(id) {
    const $titleElement = document.querySelector('.title'); // $titleElement.innerHTML
    const $categoryElement = document.querySelector('.category');
    const $ingredientsElement = document.querySelectorAll('.ingredients-items li .name');
    const $amountElement = document.querySelectorAll('.ingredients-items li .amount');
    const $instructionsElement = document.querySelector('.instructions p');
    const $cookingTimeElement = document.querySelector('.cookingtime');
    const $difficultyElement = document.querySelector('.difficulty');
    const $servingsElement = document.querySelector('.servings');

    const ingredients = combineAmoundAndName($ingredientsElement, $amountElement);

    return returnRecipe(id, $titleElement.innerHTML, $categoryElement.innerHTML, ingredients, $instructionsElement.innerHTML, $cookingTimeElement.innerHTML, $difficultyElement.innerHTML, $servingsElement.innerHTML)
}

function getIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    return id
}

function loadHTMLForAddRecipe() {
    return `
        <button class="recipe-btn edit">Edit recipe</button>
        <button class="recipe-btn save">Save recipe</button>
        <button class="recipe-btn delete">Delete recipe</button>

        <form>
            <input class="h2 title" placeholder="title" value=""></input>
            <div class="subtitle"><input class="p servings" placeholder="servings" value=""></input> | <input class="p cookingtime" placeholder="cookingtime" value=""></input> | <input class="p difficulty" placeholder="difficulty" value=""></input> | <input class="p category" placeholder="category" value=""></input></div>
            
            <div class="ingredients">
                <ul class=ingredients-items>
                    <li>•<input class="p name" placeholder="name" value=""><input class="p amount" placeholder="amount" value=""></li>
                </ul>
                <button class="addIngredient">Add ingredient</button>
            </div>

            <div class="instructions">
                <textarea placeholder="instructions"></textarea>
            </div>
        </form>
    `
}


// ————————————————————————————————————————————————————————————————————————————————————————

function editRecipe() {
    const $editBtnElement = document.querySelector('.recipe-btn.edit')
    $editBtnElement.addEventListener('click', () => {
        changeToInput('.servings', 'Servings')
        changeToInput('.cookingtime', 'Cookingtime')
        changeToInput('.difficulty', 'Difficulty')
        changeToInput('.category', 'Category')
        changeToInput('.ingredients .amount', 'Amount')
        changeToInput('.ingredients .name', 'Name')
        changeH2tagToInput('.title', 'Title')
        changePtagToTextArea('.instructions p', 'Instructions')
        const $recipeElement = document.querySelector('.recipe');
        $recipeElement.classList.add('edit');

        updateInputValue()
        updateTextAreaValue()
        addIngredientItem()
    });

}

async function saveRecipe() {
    const $saveBtnElement = document.querySelector('.recipe-btn.save');
    $saveBtnElement.addEventListener('click', async (ev) => {
        ev.preventDefault();

        // —————— FRONT-END ——————
        changeTagToPtag('input.p')
        changeTagToH2tag('input.h2')
        changeTextAreaTagToPtag('textarea')
        filterEmptyIngredientsItems()

        const $recipeElement = document.querySelector('.recipe');
        $recipeElement.classList.remove('edit');


        // —————— BACK-END ——————
        const id = getIdFromURL()
        const recipe = createRecipeFromInputFields(id ? id : null)

        try {
            if (id) {
                const response = await updateRecipeToServer(recipe)
                console.log(response)
            } else {
                const response = await saveRecipeToServer(recipe)
                window.open(`detail.html?id=${response.id}`, '_self')
            }
        } catch (error) {
            console.log(error);
        }

    });

}


async function deleteRecipe() {
    const $deleteBtnElement = document.querySelector('.recipe-btn.delete');
    $deleteBtnElement.addEventListener('click', async (ev) => {
        ev.preventDefault();
        const id = getIdFromURL()

        try {
            window.open('index.html', '_self')
            await deleteRecipeFromServer(id)
        } catch (error) {
            console.log(error);
        }
    })
}

function newRecipe() {
    const $recipeElement = document.querySelector('.recipe');

    $recipeElement.innerHTML = loadHTMLForAddRecipe();
    $recipeElement.classList.add('edit');
    $recipeElement.classList.add('new');
    updateInputValue()
    updateTextAreaValue()
    addIngredientItem()
}

async function loadPage() {    
    // LOADING PAGE
    addLoadingToElement('.recipe');

    // GET ID FROM URL
    const id = getIdFromURL()

    // CHECK IF ID EXISTS
    if (!id) {
        return newRecipe()
    }
    await getRecipe(id, addRecipeToHTML);
}




async function init() {
    try {
        await loadPage()
        editRecipe()
        await saveRecipe()
        await deleteRecipe()
    } catch (error) {
        addLoadingFailed(error);
    }
}

init()