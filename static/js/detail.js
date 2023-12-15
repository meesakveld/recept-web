function changePtagToInput(elements, placeholder) {
    const $elements = document.querySelectorAll(elements);
    $elements.forEach((elem) => {
        console.log(elem)
        elem.outerHTML = `
            <input class="${elem.getAttribute('class')}" placeholder="${placeholder}" value="${elem.innerText}"></input>
        `
    })
}

function changeInputTagToPtag(elements) {
    const $elements = document.querySelectorAll(elements);
    $elements.forEach((elem) => {
        elem.outerHTML = `
            <p class="${elem.getAttribute('class')}">${elem.getAttribute('value')}</p>
        `
    })
}

// ————————————————————————————————————————————————————————————————————————————————————————

function editTagsForEditRecipe() {
    const $editBtnElement = document.querySelector('.recipe-btn.edit')
    $editBtnElement.addEventListener('click', () => {
        changePtagToInput('.servings', 'Servings')
        changePtagToInput('.cookingtime', 'Cookingtime')
        changePtagToInput('.difficulty', 'Difficulty')
        changePtagToInput('.ingredients .amount', 'Amount')
        changePtagToInput('.ingredients .name', 'Name')
        changePtagToInput('.instructions p', 'Instruction')
        const $recipeElement = document.querySelector('.recipe');
        $recipeElement.classList.add('edit');
    });

}


function saveRecipe() {
    const $saveBtnElement = document.querySelector('.recipe-btn.save');
    $saveBtnElement.addEventListener('click', () => {
        // Save to server


        // ——— Edit interface to p tags ———
        changeInputTagToPtag('input') 
        const $recipeElement = document.querySelector('.recipe');
        $recipeElement.classList.remove('edit');
    });

}

function init() {
    editTagsForEditRecipe()
    saveRecipe()
}

init()