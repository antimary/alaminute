import { showRecipeView } from './recipe-view.js';

export class RecipeList {
    constructor (id, slots) {
        this.recipeList = document.getElementById(id);
        this.createRecipeList(this.recipeList, slots);
        console.log('recipe-list');
        console.log(this.recipeList);
    }

    createRecipeList (parent, slots) {
        parent.style.display = 'inline-block';
        // Create recipes header
        let header = parent.appendChild(document.createElement('div'));
        header.style.textAlign = 'center';
        header.style.fontSize = '2.5vw';
        header.appendChild(document.createTextNode('Recipes'));
        // Create recipe cards
        let graphs = slots.getGraphs();
        for (let graphName in graphs) {
            this.createRecipeElement(parent, graphs[graphName]);
        }
    }

    createRecipeElement (parent, recipeGraph) {
        let element = parent.appendChild(document.createElement('div'));
        element.style.fontSize = '1.5vw';
        element.style.width = '500px';
        element.style.height = '60px';
        element.style.textAlign = 'left';
        // Create image node (align-left)
        let image = element.appendChild(document.createElement('img'));
        image.src = recipeGraph.img;
        image.style.height = '50px';
        image.style.width = '50px';
        image.style.float = 'left';
        image.style.margin = '5px';
        // Create recipe title node (float-text)
        element.appendChild(document.createTextNode(recipeGraph.title));
        // Create click handler (open-recipe-view)
        console.log('recipe-list-2');
        console.log(this.recipeList);
        let recipeList = this.recipeList;
        element.addEventListener('click', function () {
            console.log('recipe-list-3');
            console.log(recipeList);
            recipeList.dispatchEvent(new CustomEvent('click-recipe-list', {
                detail: recipeGraph,
            }));
            // document.getElementById('calendar').style.display = 'none';
            // showRecipeView(recipeGraph);
        });
    }
}