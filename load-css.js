// Function to load CSS files
function loadCSS(url) {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = url;
    document.head.appendChild(linkElement);
}

// Load the CSS files
loadCSS("https://etienne113.github.io/chatFlow.github.io/style.css");
loadCSS("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");
loadCSS("https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@48,400,1,0");
