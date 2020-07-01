
import { slotUtils } from './slots.js';

export function showRecipeView (slots) {
    var mainContent = document.getElementById('main-content');
    var recipeViewParent = Object.assign(mainContent.appendChild(document.createElement('div')), {
        id: 'recipe-view-parent',
    });
    recipeViewParent.style.width = '100%';
    recipeViewParent.style.textAlign = 'center';
    var recipeView = Object.assign(recipeViewParent.appendChild(document.createElement('div')), {
        id: 'recipe-view',
    });
    recipeView.style.width = '500px';
    recipeView.style.display = 'inline-block';

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
    recipeSummary.style.fontSize = '75%';
    recipeSummary.appendChild(document.createElement('div')).appendChild(
        document.createTextNode(getSessionSummary(slots))
    );
    recipeSummary.appendChild(document.createElement('div')).appendChild(
        document.createTextNode(getTimeSummary(slots))
    );

    showSlots(slots, recipeView);
}

function getSessionSummary (slots) {
    let summaryText = '';
    if (slots.numSessions > 0) {
        summaryText += slots.numSessions + ' session';
        if (slots.numSessions > 1) {
            summaryText += 's';
        }
    }
    if (slotUtils.getNumThaws(slots) > 0) {
        if (summaryText) {
            summaryText += ' / ';
        }
        summaryText += slotUtils.getNumThaws(slots) + ' thaw';
        if (slotUtils.getNumThaws(slots) > 1) {
            summaryText += 's';
        }
    }
    return summaryText;
}

function getTimeSummary (slots) {
    let summaryText = '';
    summaryText += formatSpace(slotUtils.getSlotTime(slots));
    summaryText += ' ';
    summaryText += '(start ' + formatSpace(slots.totalTime) + ' ahead)';
    return summaryText;
}

function showSlot(slot, parent, index) {
    var slotView = Object.assign(parent.appendChild(document.createElement('div')), {
        id: 'slot-' + slot.graphName + '-' + index,
    });
    slotView.style.textAlign = 'left';
    slotView.style.margin = '25px';
    slotView.style.border = 'thin solid grey';
    slotView.style.backgroundColor = 'white';

    var slotHeader = Object.assign(slotView.appendChild(document.createElement('div')), {
        id: 'slot-header-' + slot.graphName + '-' + index,
    });
    slotHeader.style.margin = '10px';
    var slotHeaderText = slotHeader.appendChild(document.createElement('div'));
    let slotName = slot.name;
    if (slot.longestStep.node) {
        slotName += ' (' + slot.longestStep.node + ')';
    }
    slotHeaderText.appendChild(document.createElement('div')).appendChild(document.createTextNode(slotName));
    var slotTime = slotHeaderText.appendChild(document.createElement('div'));
    slotTime.style.fontSize = '80%';
    slotTime.style.color = 'darkslategrey';
    slotTime.appendChild(document.createTextNode(slot.time + 'm'));

    var slotContent = Object.assign(slotView.appendChild(document.createElement('div')), {
        id: 'slot-content-' + slot.graphName + '-' + index,
    });
    slotContent.style.margin = '10px';
    slotContent.style.fontSize = '80%';
    for (let i=0; i<slot.steps.length; i++) {
        let slotStep = slotContent.appendChild(document.createElement('div'));
        slotStep.appendChild(document.createTextNode(slot.steps[i].instructions));
        slotStep.style.margin = '5px 0';
    }
}

function formatSpace(spaceTime) {
    let days = Math.floor(spaceTime / (60 * 24));
    let hours = Math.floor((spaceTime - (60*24*days)) / 60);
    let minutes = spaceTime - (60*24*days) - 60*hours;

    let result = minutes + 'm';
    if (hours > 0) {
        result = hours + 'h ' + result;
    }
    if (days > 0) {
        result = days + 'd ' + result;
    }
    return result;
}

function showSpace(prevSlot, nextSlot, parent) {
    let spaceTime = slotUtils.getSpace(prevSlot, nextSlot);
    if (spaceTime > 0) {
        let spaceView = Object.assign(parent.appendChild(document.createElement('div')), {
            id: 'space-' + prevSlot.graphName + '-' + nextSlot.graphName,
        });
        spaceView.style.fontSize = '80%';
        spaceView.style.color = 'darkslategrey';
        spaceView.style.border = 'thin solid grey';
        spaceView.style.backgroundColor = 'white';
        spaceView.style.display = 'inline-block';
        let spaceTimeView = spaceView.appendChild(document.createElement('div'));
        spaceTimeView.style.margin = '5px';
        spaceTimeView.appendChild(document.createTextNode(formatSpace(spaceTime)));
    }
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
    var recipeViewParent = document.getElementById('recipe-view-parent');
    mainContent.removeChild(recipeViewParent);
}