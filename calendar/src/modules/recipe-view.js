
import { getSpace } from './slots.js';

export function showRecipeView (slots) {
    var mainContent = document.getElementById('main-content');
    var recipeView = Object.assign(mainContent.appendChild(document.createElement('div')), {
        id: 'recipe-view',
    });

    // Header section
    var recipeHeader = Object.assign(recipeView.appendChild(document.createElement('div')), {
        id: 'recipe-header',
    });
    recipeHeader.style.textAlign = 'left';
    recipeHeader.style.margin = '25px';
    var recipeImage = Object.assign(recipeHeader.appendChild(document.createElement('img')), {
        id: 'recipe-image',
        src: slots.graph.img,
    });
    recipeImage.style.width = '100px';
    recipeImage.style.marginRight = '10px';

    // {
    //     float: 'right',
    //     display: 'inline-block',
    //     color: 'green',
    // },
    var headerText = Object.assign(recipeHeader.appendChild(document.createElement('div')), {
        id: 'header-text',
    });
    headerText.style.display = 'inline-block';
    headerText.style.verticalAlign = 'top';

    var recipeTitle = Object.assign(headerText.appendChild(document.createElement('div')), {
        id: 'recipe-title',
    })
    recipeTitle.appendChild(document.createTextNode(slots.graph.title));

    var recipeSummary = Object.assign(headerText.appendChild(document.createElement('div')), {
        id: 'recipe-summary',
    });
    recipeSummary.style.color = 'grey';
    recipeSummary.style.fontSize = '80%';
    recipeSummary.appendChild(document.createTextNode('5 slots, 1h7m, 1-2d'))

    showSlots(slots, recipeView);
}

function showSlot(slot, parent, index) {
    var slotView = Object.assign(parent.appendChild(document.createElement('div')), {
        id: 'slot-' + slot.graphName + '-' + index,
    });
    slotView.style.textAlign = 'left';
    slotView.style.margin = '25px';
    slotView.appendChild(document.createElement('div')).appendChild(document.createTextNode('Time: ' + slot.time));
    for (let i=0; i<slot.steps.length; i++) {
        slotView.appendChild(document.createElement('div')).appendChild(document.createTextNode(slot.steps[i].instructions));
    }
}

function showSpace(prevSlot, nextSlot, parent) {
    let spaceView = Object.assign(parent.appendChild(document.createElement('div')), {
        id: 'space-' + prevSlot.graphName + '-' + nextSlot.graphName,
    });
    spaceView.appendChild(document.createElement('div')).appendChild(
        document.createTextNode('Space: ' + getSpace(prevSlot, nextSlot)
    ));
}

function showSlots(slots, parent) {
    let prevSlot = null;
    for (let i=0; i<slots.slots.length; i++) {
        let currSlot = slots.slots[i];
        if (currSlot && prevSlot) {
            showSpace(prevSlot, currSlot, parent);
        }
        showSlot(currSlot, parent, i);
        prevSlot = currSlot;
    }
}

export function hideRecipeView () {
    var mainContent = document.getElementById('main-content');
    var recipeView = document.getElementById('recipe-view');
    mainContent.removeChild(recipeView);
}