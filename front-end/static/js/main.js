function loadDarkmode() {
    document.querySelector('#dark-mode-toggle').addEventListener('click', function () {
        document.querySelector('html').toggleAttribute('dark-mode')
    })    
}

function init() {
    loadDarkmode()
}

init()