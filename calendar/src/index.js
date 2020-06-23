import { calendar } from './modules/calendar.js';
import { slots } from './modules/slots.js';
import { RecipeList } from './modules/recipe-list.js';

document.querySelector('#month').addEventListener('click', function () {
    calendar.changeView('month', true);
});

document.querySelector('#prep').addEventListener('click', function () {
    calendar.changeView('week', true);
});

let recipeList = new RecipeList('recipe-list', slots);
recipeList.recipeList.addEventListener('click-recipe-list', function (event) {
    let recipeGraph = event.detail;
    console.log('click-recipe-list');
    console.log(recipeGraph);
});
console.log(slots);