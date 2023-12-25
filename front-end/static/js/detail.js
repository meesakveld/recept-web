import { addLoadingToElement, addLoadingFailed } from './utils.js';
import { getRecipe } from './api.js';



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
        
        <form>
            <h2 class="h2 title">${recipe.title}</h2>
            <div class="subtitle"><p class="p servings">${recipe.servings}p</p> | <p class="p cookingtime">${recipe.cookingTime}min</p> | <p class="p difficulty">${recipe.difficulty}</p></div>
            
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



// ————————————————————————————————————————————————————————————————————————————————————————

function editTagsForEditRecipe() {
    const $editBtnElement = document.querySelector('.recipe-btn.edit')
    $editBtnElement.addEventListener('click', () => {
        changeToInput('.servings', 'Servings')
        changeToInput('.cookingtime', 'Cookingtime')
        changeToInput('.difficulty', 'Difficulty')
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

function saveRecipe() {
    const $saveBtnElement = document.querySelector('.recipe-btn.save');
    $saveBtnElement.addEventListener('click', () => {
        // ——— Edit interface to p tags ———
        changeTagToPtag('input.p')
        changeTagToH2tag('input.h2')
        changeTextAreaTagToPtag('textarea')
        filterEmptyIngredientsItems()

        const $recipeElement = document.querySelector('.recipe');
        $recipeElement.classList.remove('edit');

        
        // ——— Save to server ———
        const $ingredientsElement = document.querySelectorAll('.ingredients-items li .name');
        const $amountElement = document.querySelectorAll('.ingredients-items li .amount');
        console.log(combineAmoundAndName($ingredientsElement, $amountElement));
    });

}

async function loadRecipeFromURL() {
    addLoadingToElement('.recipe');
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    await getRecipe(id, addRecipeToHTML);
}




async function init() {
    try {
        await loadRecipeFromURL()
        editTagsForEditRecipe()
        saveRecipe()
    } catch (error) {
        addLoadingFailed(error);
    }
}

init()