import { calendar } from './modules/calendar.js';
import { slotsMap } from './modules/slots.js';
import { RecipeList } from './modules/recipe-list.js';
import { showRecipeView, hideRecipeView } from './modules/recipe-view.js';

let hamburgerIcon = document.querySelector('#hamburger-icon');
hamburgerIcon.onclick = (event) => {
    let hamburgerMenu = document.querySelector('#hamburger-menu');
    if (hamburgerMenu.style.display == 'none') {
        hamburgerMenu.style.display = 'inline-block';
    } else {
        hamburgerMenu.style.display = 'none';
    }
}

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

let calendarTab = document.querySelector('#calendar-tab');
if (calendarTab) {
    calendarTab.addEventListener('click', function () {
        document.querySelector('#calendar-container').style.display = 'block';
        document.querySelector('#recipe-list').style.display = 'none';
        hideRecipeView();
    });
}
let recipeTab = document.querySelector('#recipe-tab');
if (recipeTab) {
    recipeTab.addEventListener('click', function () {
        document.querySelector('#recipe-list').style.display = 'block';
        document.querySelector('#calendar-container').style.display = 'none';
        hideRecipeView();
    });
}

let recipeList = new RecipeList('recipe-list', slotsMap);
recipeList.recipeList.addEventListener('click-recipe-list', function (event) {
    let slot = event.detail;
    showRecipeView(slot);
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