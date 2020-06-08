import Calendar from '../../../tui.calendar'; /* ES6 */
import "../../../tui.calendar/dist/tui-calendar.css";

// If you use the default popups, use this.
import '../../../tui.calendar/node_modules/tui-date-picker/dist/tui-date-picker.css';
import '../../../tui.calendar/node_modules/tui-time-picker/dist/tui-time-picker.css';

// ****************************************
// TUI CALENDAR
// ****************************************
export var calendar = new Calendar('#calendar', {
    defaultView: 'week',
    taskView: true,
    week: {
        startDayOfWeek: 5,
        daynames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        workweek: 3,
    }
});

calendar.setDate(startDate);
console.log ('startDate');
console.log (startDate);
console.log ('endDate');
console.log (endDate);
calendar.setCalendarColor('2', {    // meals
    color: '#282828',
    bgColor: '#dc9656',
    borderColor: '#a1b56c',
    dragBgColor: '#dc9656',
});
calendar.setCalendarColor('3', {    // placeholders
    bgColor: '#a9a9a9',
});
calendar.setCalendarColor('errand', {  // errands
    bgColor: '#ffcccb',
});
calendar.setCalendarColor('busy', {bgColor: '#d3d3d3'});

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
            busySchedules.push(schedule);
        }
    }
    calendar.createSchedules(busySchedules);
});

calendar.createSchedules([
    {
        id: '1',
        calendarId: '1',
        title: 'Supp (kara-cook) ',
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
        title: 'Mise (kara-mise)',
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
        title: 'Lunch (karaage / rice-peas-pepp / spin)',
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
]);