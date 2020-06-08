import { calendar } from './modules/calendar.js';
import { graph } from './modules/graph.js';

document.querySelector('#month').addEventListener('click', function () {
    calendar.changeView('month', true);
});

document.querySelector('#prep').addEventListener('click', function () {
    calendar.changeView('week', true);
});

