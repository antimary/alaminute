import { calendar } from './modules/calendar.js';
import { slotsMap } from './modules/slots.js';
import { RecipeList } from './modules/recipe-list.js';
import { showRecipeView, hideRecipeView } from './modules/recipe-view.js';

document.querySelector('#month').addEventListener('click', function () {
    calendar.changeView('month', true);
});

document.querySelector('#prep').addEventListener('click', function () {
    calendar.changeView('week', true);
});

let recipeList = new RecipeList('recipe-list', slotsMap);
recipeList.recipeList.addEventListener('click-recipe-list', function (event) {
    let slot = event.detail;
    console.log('click-recipe-list');
    console.log(slot);

    let calendarContainer = document.getElementById('calendar-container');
    if (calendarContainer.style.display == 'none') {
        calendarContainer.style.display = 'block';
        hideRecipeView();
    } else {
        calendarContainer.style.display = 'none';
        showRecipeView(slot);
    }

    //let recipeViewContainer = Object.assign(document.createElement('div'), { 'id': 'recipe-view-container' });
    
});
console.log(slotsMap);
console.log(recipeList);