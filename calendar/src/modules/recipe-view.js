
export function showRecipeView (slots) {
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
        src: slots.graph.img,
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
    recipeTitle.appendChild(document.createTextNode(slots.graph.title));

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

function showSlots(slots, parent) {
    for (let i=0; i<slots.slots.length; i++) {
        showSlot(slots.slots[i], parent, i);
    }
}

export function hideRecipeView () {
    var mainContent = document.getElementById('main-content');
    var recipeView = document.getElementById('recipe-view');
    mainContent.removeChild(recipeView);
}