
export function showRecipeView (graph) {
    var mainContent = document.getElementById('main-content');
    var recipeView = Object.assign(mainContent.appendChild(document.createElement('div')), {
        id: 'recipe-view',
    });

    // Header section
    var recipeHeader = Object.assign(recipeView.appendChild(document.createElement('div')), {
        id: 'recipe-header',
    });
    var recipeImage = Object.assign(recipeHeader.appendChild(document.createElement('img')), {
        id: 'recipe-image',
        src: graph.img,
    });
    recipeImage.style.width = '100px';
    // {
    //     float: 'right',
    //     display: 'inline-block',
    //     color: 'green',
    // },
    var recipeTitle = Object.assign(recipeHeader.appendChild(document.createElement('div')), {
        id: 'recipe-title',
    });
    recipeTitle.style.display = 'inline-block';
    console.log(recipeTitle);
    recipeTitle.appendChild(document.createTextNode(graph.title));
}