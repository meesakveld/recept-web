function addLoadingToElement(element) {
    const html = () => {
        return `
            <div class="loading">
                <p>Loading...</p>
            </div>
        `
    }

    const $element = document.querySelector(element);
    $element.innerHTML = html();
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



export {
    addLoadingToElement,
    addLoadingFailed,
}