import { calendar } from './modules/calendar.js';
import { slotsMap } from './modules/slots.js';
import { RecipeList } from './modules/recipe-list.js';
import { showRecipeView, hideRecipeView } from './modules/recipe-view.js';

let monthBtn = document.querySelector('#month');
if (monthBtn) {
    monthBtn.addEventListener('click', function () {
        calendar.changeView('month', true);
    });
}

let prepBtn = document.querySelector('#prep');
if (prepBtn) {
    prepBtn.addEventListener('click', function () {
        calendar.changeView('week', true);
    });
}

let recipeList = new RecipeList('recipe-list', slotsMap);
recipeList.recipeList.addEventListener('click-recipe-list', function (event) {
    let slot = event.detail;

    let calendarContainer = document.getElementById('calendar-container');
    if (calendarContainer.style.display == 'none') {
        calendarContainer.style.display = 'block';
        hideRecipeView();
    } else {
        calendarContainer.style.display = 'none';
        showRecipeView(slot);
    }
});
