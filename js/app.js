import { login, logout, monitorAuth } from './auth.js';
// Note: i18n and zodiacCalendar are loaded globally via script tags in index.html for simplicity, 
// but in a module system we would import them. Since they are global in this setup:
const calendar = window.zodiacCalendar;
const i18n = window.i18n;

class App {
    constructor() {
        this.currentViewDate = new Date(); // Gregorian date for the view
        this.selectedDate = null; // { year, month, day }

        this.init();
    }

    init() {
        // Initialize I18n
        i18n.init();

        // Event Listeners
        document.getElementById('prev-month').addEventListener('click', () => this.changeMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => this.changeMonth(1));

        const authBtn = document.getElementById('auth-btn');
        authBtn.addEventListener('click', () => {
            if (authBtn.textContent === i18n.t('login')) {
                login();
            } else {
                logout();
            }
        });

        // Auth State
        monitorAuth((user) => {
            if (user) {
                authBtn.textContent = i18n.t('logout');
                // Load user notes if any
            } else {
                authBtn.textContent = i18n.t('login');
            }
        });

        // Listen for language change
        window.addEventListener('lang-changed', () => this.render());

        // Initial Render
        this.render();
    }

    changeMonth(delta) {
        // We need to shift the *Zodiac* month
        const zDate = calendar.fromGregorian(this.currentViewDate);
        let newMonth = zDate.month + delta;
        let newYear = zDate.year;

        if (newMonth > 13) {
            newMonth = 0;
            newYear++;
        } else if (newMonth < 0) {
            newMonth = 13;
            newYear--;
        }

        // Set view date to the 1st of the new Zodiac month
        this.currentViewDate = calendar.toGregorian(newYear, newMonth, 1);
        this.render();
    }

    render() {
        this.renderCurrentDatePanel();
        this.renderMonthGrid();
    }

    renderCurrentDatePanel() {
        const now = new Date();
        const zDate = calendar.fromGregorian(now);

        document.getElementById('current-day-name').textContent = i18n.getWeekdayName(zDate.weekday);
        document.getElementById('current-day-number').textContent = zDate.day;
        document.getElementById('current-month-year').textContent = `${i18n.getMonthName(zDate.month)} ${zDate.year}`;
    }

    renderMonthGrid() {
        const zDate = calendar.fromGregorian(this.currentViewDate);
        const year = zDate.year;
        const month = zDate.month;

        // Update Header
        document.getElementById('display-month-title').textContent = `${i18n.getMonthName(month)} ${year}`;

        // Weekdays Header
        const weekdaysContainer = document.getElementById('weekdays-header');
        weekdaysContainer.innerHTML = '';
        for (let i = 0; i < 7; i++) {
            const div = document.createElement('div');
            div.textContent = i18n.getWeekdayName(i).substring(0, 3); // Short name
            weekdaysContainer.appendChild(div);
        }

        // Days Grid
        const grid = document.getElementById('days-grid');
        grid.innerHTML = '';

        const daysInMonth = calendar.getDaysInMonth(year, month);

        // Calculate start weekday of the month
        // We need the Gregorian date of the 1st of this Zodiac month
        const firstDayGregorian = calendar.toGregorian(year, month, 1);
        const startWeekday = firstDayGregorian.getDay(); // 0-6

        // Empty cells for offset
        for (let i = 0; i < startWeekday; i++) {
            const div = document.createElement('div');
            grid.appendChild(div);
        }

        // Day cells
        const todayZ = calendar.fromGregorian(new Date());

        for (let d = 1; d <= daysInMonth; d++) {
            const div = document.createElement('div');
            div.className = 'day-cell';
            div.textContent = d;

            // Highlight today
            if (todayZ.year === year && todayZ.month === month && todayZ.day === d) {
                div.classList.add('current-day');
            }

            div.addEventListener('click', () => {
                // Select date logic
                document.querySelectorAll('.day-cell').forEach(c => c.classList.remove('selected'));
                div.classList.add('selected');
                this.selectedDate = { year, month, day: d };
                console.log("Selected:", this.selectedDate);
                // TODO: Show notes modal
            });

            grid.appendChild(div);
        }
    }
}

// Start App
window.app = new App();
