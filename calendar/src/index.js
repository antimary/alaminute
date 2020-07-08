import { calendar } from './modules/calendar.js';
import { slotsMap } from './modules/slots.js';
import { RecipeList } from './modules/recipe-list.js';
import { showRecipeView, hideRecipeView } from './modules/recipe-view.js';

window.modalContentIds = [];
let modalChildren = document.getElementById('modal-content').children;
for (let i=0; i<modalChildren.length; i++) {
    let child = modalChildren[i];
    if (child.id) {
        modalContentIds.push(child.id);
    }
}

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

document.getElementById('close').onclick = function () {
    window.closeModal();
}
window.onclick = function () {
    let modal = document.getElementById('modal');
    if (event.target == modal) {
        window.closeModal();
    }
}

window.closeModal = function () {
    let modalContent = document.getElementById('modal-content');
    let children = modalContent.children;
    for (let i=children.length-1; i>0; i--) {
        let child = children[i];
        if (!window.modalContentIds.includes(child.id)) {
            child.remove();
        }
    }
    document.getElementById('modal').style.display = 'none';
}