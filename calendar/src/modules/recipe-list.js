import { showRecipeView } from './recipe-view.js';

export class RecipeList {
    constructor (id, slotsMap) {
        this.recipeList = document.getElementById(id);
        this.createRecipeList(this.recipeList, slotsMap);
    }

    createRecipeList (parent, slotsMap) {
        // Create recipes header
        let header = parent.appendChild(document.createElement('div'));
        header.style.textAlign = 'center';
        /*header.style.fontSize = '2.5vw';*/
        /*header.appendChild(document.createTextNode('Recipes'));*/
        // Create recipe cards
        for (let graphName in slotsMap) {
            this.createRecipeElement(parent, slotsMap[graphName]);
        }
    }

    createRecipeElement (parent, slots) {
        let element = parent.appendChild(document.createElement('div'));
        let recipeGraph = slots.graph;
        element.style.fontSize = '75%';
        element.style.maxWidth = '500px';
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
        let recipeList = this.recipeList;
        element.addEventListener('click', function () {
            recipeList.dispatchEvent(new CustomEvent('click-recipe-list', {
                detail: slots,
            }));
            // document.getElementById('calendar').style.display = 'none';
            // showRecipeView(recipeGraph);
        });
    }

    
}