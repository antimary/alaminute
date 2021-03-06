import Calendar from '../../../tui.calendar'; /* ES6 */
import "../../../tui.calendar/dist/tui-calendar.css";

import { showRecipeView } from './recipe-view.js';
import { slotsMap, slotUtils } from './slots.js';

// If you use the default popups, use this.
import '../../../tui.calendar/node_modules/tui-date-picker/dist/tui-date-picker.css';
import '../../../tui.calendar/node_modules/tui-time-picker/dist/tui-time-picker.css';
import { RecipeList } from './recipe-list';

// ****************************************
// TUI CALENDAR
// ****************************************
export var calendar = new Calendar('#calendar', {
    defaultView: 'week',
    taskView: false,
    week: {
        startDayOfWeek: 5,
        daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        workweek: 3,
    }
});

function createSlotSchedule (scheduleId, recipeName, slotIds) {
    return {
        scheduleId: scheduleId,
        recipeName: recipeName,
        slotIds: slotIds,
    };
}

function formatTimezone (dateTime) {
    var timezoneOffsetHours = new Date().getTimezoneOffset() / 60;
    return dateTime + '-' + ('0' + timezoneOffsetHours).slice(-2) + ':00';
}

var slotSchedule = {
//    '9': createSlotSchedule('9', 'karaage/rice-peas/spin-ses/pepp-dash'),
//    '1': createSlotSchedule('1', 'karaage/rice-peas/spin-ses/pepp-dash', [7, 8]),
   '9': createSlotSchedule('9', 'karaage'),
   '1': createSlotSchedule('1', 'karaage', [3, 4]),
   '7': createSlotSchedule('7', 'karaage', [3, 4]),
   '6': createSlotSchedule('6', 'karaage', [1, 2]),
   '5': createSlotSchedule('5', 'karaage', [1, 2]),
   '8': createSlotSchedule('8', 'karaage', [0]),
}

var karaageSchedule = [
    {
        id: '9',
        calendarId: '2',
        title: 'Lunch (Karaage Bento)',
        category: 'time',
        dueDateClass: '',
        start: formatTimezone('2020-05-31T12:00:00'),
        end: formatTimezone('2020-05-31T13:00:00'),
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '1',
        calendarId: '1',
        title: 'Á la Minute (fry-chicken) ',
        category: 'time',
        dueDateClass: '',
        start: formatTimezone('2020-05-31T11:30:00'),
        end: formatTimezone('2020-05-31T12:00:00')
    },
    {
        id: '7',
        calendarId: '1',
        title: 'Mise (heat-oil)',
        category: 'time',
        dueDateClass: '',
        start: formatTimezone('2020-05-31T10:45:00'),
        end: formatTimezone('2020-05-31T11:00:00'),
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '6',
        calendarId: '1',
        title: 'Prep (marinate-chicken)',
        category: 'time',
        dueDateClass: '',
        start: formatTimezone('2020-05-31T08:00:00'),
        end: formatTimezone('2020-05-31T08:30:00'),
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '5',
        calendarId: '1',
        title: 'Mise (marinade-ginger)',
        category: 'time',
        dueDateClass: '',
        start: formatTimezone('2020-05-31T07:15:00'),
        end: formatTimezone('2020-05-31T07:30:00'),
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '8',
        calendarId: '1',
        title: 'Mise (chicken-thaw)',
        category: 'time',
        dueDateClass: '',
        start: formatTimezone('2020-05-30T19:30:00'),
        end: formatTimezone('2020-05-30T20:00:00'),
        isReadOnly: false    // can move?
    },
];

var mealRoutine = [
    {
        id: '16',
        calendarId: '3',
        title: 'Dinner',
        category: 'time',
        dueDateClass: '',
        start: formatTimezone('2020-05-29T18:30:00'),
        end: formatTimezone('2020-05-29T19:30:00'),
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '17',
        calendarId: '3',
        title: 'Dinner',
        category: 'time',
        dueDateClass: '',
        start: formatTimezone('2020-05-30T18:30:00'),
        end: formatTimezone('2020-05-30T19:30:00'),
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '18',
        calendarId: '3',
        title: 'Dinner',
        category: 'time',
        dueDateClass: '',
        start: formatTimezone('2020-05-31T18:30:00'),
        end: formatTimezone('2020-05-31T19:30:00'),
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '19',
        calendarId: '3',
        title: 'Lunch',
        category: 'time',
        dueDateClass: '',
        start: formatTimezone('2020-05-29T12:00:00'),
        end: formatTimezone('2020-05-29T13:00:00'),
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '20',
        calendarId: '3',
        title: 'Lunch',
        category: 'time',
        dueDateClass: '',
        start: formatTimezone('2020-05-30T12:00:00'),
        end: formatTimezone('2020-05-30T13:00:00'),
        isReadOnly: true    // schedule is read-only
    },
];

var initRoutine = [
    {
        id: '21',
        calendarId: '3',
        title: 'Lunch',
        category: 'time',
        dueDateClass: '',
        start: formatTimezone('2020-05-31T12:00:00'),
        end: formatTimezone('2020-05-31T13:00:00'),
        isReadOnly: true    // schedule is read-only
    },
];

function getScheduledSlots (scheduleId) {
    let result = null;
    let slotScheduleObj = slotSchedule[scheduleId];
    if (slotScheduleObj) {
        let slotsObj = slotsMap[slotScheduleObj.recipeName];
        let slotIds = slotScheduleObj.slotIds;
        if (slotIds) {
            result = slotUtils.copySlotsObj(slotsObj);
            let filteredSlots = [];
            let totalTime = 0;
            let prevSlot = null;
            for (let i=0; i<slotIds.length; i++) {
                let slot = slotsObj.slots[slotIds[i]];
                filteredSlots.push(slot);
                totalTime += slot.time;
                if (prevSlot) {
                    totalTime += slotUtils.getSpace(prevSlot, slot);
                }
                prevSlot = slot;
            }
            result.slots = filteredSlots;
            result.totalTime = totalTime;
            result.numSessions = 1;
        } else {
            result = slotsObj;
        }
    }
    return result;
}

calendar.setDate(startDate);

calendar.setCalendarColor('2', {    // meals
    color: '#282828',
    bgColor: '#dc9656',
    borderColor: '#a1b56c',
    dragBgColor: '#dc9656',
});
calendar.setCalendarColor('3', {    // placeholders
    bgColor: '#f0f0f0',
});
calendar.setCalendarColor('errand', {  // errands
    bgColor: '#ffcccb',
});
calendar.setCalendarColor('busy', {bgColor: '#d3d3d3'});

calendar.on('clickSchedule', function(event) {
    var schedule = event.schedule;

    // Routine calendar
    if (schedule.calendarId == '3') {
        document.getElementById('modal').style.display = 'block';
        let recipeModal = new RecipeList('modal-content', slotsMap);
        recipeModal.recipeList.addEventListener('click-recipe-list', function (event) {
            let slotsObj = event.detail;
            if (slotsObj.graphName == 'karaage') {
                calendar.clear();
                calendar.createSchedules(mealRoutine);
                calendar.createSchedules(karaageSchedule);
            }

            window.closeModal();
        });
    }
    // Slots calendar
    else {
        let slotsObj = getScheduledSlots(schedule.id);
        if (slotsObj) {
            showRecipeView(slotsObj);
        }
    }
});

calendar.on('beforeUpdateSchedule', function (event) {
    var schedule = event.schedule;
    var changes = event.changes;

    calendar.updateSchedule(schedule.id, schedule.calendarId, changes);
})

window.addEventListener('gcal-loaded', function (e) {
    let upcomingEvents = e.detail.upcomingEvents;

    var busySchedules = [];
    var busyStartId = 100;
    if (upcomingEvents.length > 0) {
        for (let i=0; i<upcomingEvents.length; i++) {
            let event = upcomingEvents[i];
            let schedule = {
                id: busyStartId + i,
                calendarId: 'busy',
                title: event.summary,
                start: event.start.date ? event.start.date : event.start.dateTime,
                end: event.end.date ? event.end.date : event.end.dateTime,
                category: 'time',
            }
            console.log('schedule');
            console.log(schedule);
            busySchedules.push(schedule);
        }
    }
    calendar.createSchedules(busySchedules);
});

var origRoutineSchedule = [
    {
        id: '1',
        calendarId: '1',
        title: 'Á la Minute (fry-chicken) ',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-31T11:30:00',
        end: '2020-05-31T12:00:00'
    },
    {
        id: '2',
        calendarId: '1',
        title: 'Wrap (kara-thaw-thighs)',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-29T19:30:00',
        end: '2020-05-29T20:00:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '3',
        calendarId: '1',
        title: 'Mise (wash / dry)',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-30T13:15:00',
        end: '2020-05-30T13:30:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '4',
        calendarId: '1',
        title: 'Feat (kara-marinate / kara-sauce-prep)',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-30T14:00:00',
        end: '2020-05-30T14:30:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '5',
        calendarId: '1',
        title: 'Wake (spin-mise / pepp-mise)',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-31T07:15:00',
        end: '2020-05-31T07:30:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '6',
        calendarId: '1',
        title: 'Simmer (spin-cook / pepp-cook)',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-31T08:00:00',
        end: '2020-05-31T08:30:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '7',
        calendarId: '1',
        title: 'Mise (heat-oil)',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-31T10:45:00',
        end: '2020-05-31T11:00:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '8',
        calendarId: '1',
        title: 'Wrap (rice-wash-set)',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-30T19:30:00',
        end: '2020-05-30T20:00:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '9',
        calendarId: '2',
        title: 'Lunch (Karaage Bento)',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-31T12:00:00',
        end: '2020-05-31T13:00:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '10',
        calendarId: '3',
        title: 'Brunch (',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-30T10:30:00',
        end: '2020-05-30T11:30:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '11',
        calendarId: 'errand',
        title: 'Grocery (marina-super)',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-30T12:00:00',
        end: '2020-05-30T12:30:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '12',
        calendarId: '3',
        title: 'Eod (',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-30T17:15:00',
        end: '2020-05-30T17:30:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '13',
        calendarId: '3',
        title: 'Market (',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-30T18:00:00',
        end: '2020-05-30T18:30:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '14',
        calendarId: '3',
        title: 'Eod (',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-31T17:15:00',
        end: '2020-05-31T17:30:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '15',
        calendarId: '3',
        title: 'Market (',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-31T18:00:00',
        end: '2020-05-31T18:30:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '16',
        calendarId: '3',
        title: 'Dinner (',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-30T18:30:00',
        end: '2020-05-30T19:30:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '17',
        calendarId: '3',
        title: 'Dinner (',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-31T18:30:00',
        end: '2020-05-31T19:30:00',
        isReadOnly: true    // schedule is read-only
    },
    {
        id: '18',
        calendarId: '3',
        title: 'Dinner (',
        category: 'time',
        dueDateClass: '',
        start: '2020-05-29T18:30:00',
        end: '2020-05-29T19:30:00',
        isReadOnly: true    // schedule is read-only
    },
];

calendar.createSchedules(mealRoutine.concat(initRoutine));