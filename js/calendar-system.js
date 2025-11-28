/**
 * Zodiac Calendar System
 * 
 * Structure:
 * - 13 Months of 28 days each = 364 days
 * - 1 "Sol" Month (Month 0 or 14, handled as extra) of 1 day (2 days in leap years)
 * - Total: 365 or 366 days
 * - Start Date: Dec 22 (Winter Solstice)
 * - Epoch: Dec 22, 1970
 */

class ZodiacCalendar {
    constructor() {
        this.EPOCH_YEAR = 1970;
        this.EPOCH_MONTH = 11; // December (0-indexed in JS Date)
        this.EPOCH_DAY = 22;
        
        // Month names will be loaded from i18n, these are keys
        this.MONTH_KEYS = [
            'capricorn', 'aquarius', 'pisces', 'aries', 'taurus', 'gemini',
            'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'ophiuchus', 'sagittarius', 'sol'
        ];
    }

    isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    /**
     * Converts a Gregorian Date object to Zodiac Date
     * @param {Date} date 
     * @returns {Object} { year, monthIndex, day, dayOfWeekIndex }
     */
    fromGregorian(date) {
        // Clone date to avoid mutation
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        // Determine the Zodiac Year
        // If date is before Dec 22, it belongs to the previous Zodiac year's cycle relative to Gregorian year?
        // Actually, let's define Zodiac Year Y starts on Dec 22 of Gregorian Year Y-1.
        // Example: Zodiac 1971 starts Dec 22, 1970.
        // Wait, user said: "el primer año inicia después del solsticio de invierno de 1970"
        // Let's assume Year 1 (or 1971) starts Dec 22, 1970.
        
        let gYear = targetDate.getFullYear();
        const solstice = new Date(gYear, 11, 22); // Dec 22 of current Gregorian year
        
        let zYear = gYear + 1;
        let startOfZYear;

        if (targetDate >= solstice) {
            // It's in the beginning of the new Zodiac Year
            startOfZYear = solstice;
        } else {
            // It's in the current Zodiac Year (which started previous Dec 22)
            zYear = gYear;
            startOfZYear = new Date(gYear - 1, 11, 22);
        }

        // Calculate day of year (0-indexed)
        const diffTime = Math.abs(targetDate - startOfZYear);
        const dayOfYear = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        // 13 months of 28 days = 364 days.
        // Day 364 is Sol 1. Day 365 is Sol 2 (if leap).
        
        let monthIndex;
        let dayOfMonth;

        if (dayOfYear < 364) {
            monthIndex = Math.floor(dayOfYear / 28);
            dayOfMonth = (dayOfYear % 28) + 1;
        } else {
            // Sol Month (Index 13)
            monthIndex = 13;
            dayOfMonth = (dayOfYear - 364) + 1;
        }

        // Day of week (1-7)
        // Since every month is 28 days, the day of week is consistent if we ignore Sol?
        // Or do we keep standard 7-day week cycle independent of months?
        // User said: "los nombres de los días se pueden mantener como actualmente se nombran"
        // Usually 13-month calendars make every month start on Sunday.
        // But if we want to map to real weekdays, we just take the JS getDay().
        const dayOfWeekIndex = targetDate.getDay(); // 0 = Sunday

        return {
            year: zYear,
            month: monthIndex, // 0-13
            day: dayOfMonth,
            weekday: dayOfWeekIndex
        };
    }

    /**
     * Converts Zodiac Date to Gregorian Date
     * @param {number} year 
     * @param {number} monthIndex 
     * @param {number} day 
     * @returns {Date}
     */
    toGregorian(year, monthIndex, day) {
        // Zodiac Year Y starts Dec 22, Y-1.
        const startOfZYear = new Date(year - 1, 11, 22);
        
        let daysToAdd = 0;
        
        if (monthIndex < 13) {
            daysToAdd = (monthIndex * 28) + (day - 1);
        } else {
            // Sol month
            daysToAdd = 364 + (day - 1);
        }

        const resultDate = new Date(startOfZYear);
        resultDate.setDate(resultDate.getDate() + daysToAdd);
        return resultDate;
    }
    
    getDaysInMonth(year, monthIndex) {
        if (monthIndex < 13) return 28;
        // Sol month
        // Check if Zodiac Year is Leap.
        // Zodiac Year Y covers most of Gregorian Year Y.
        // Let's use Gregorian Year Y rules for Zodiac Year Y.
        return this.isLeapYear(year) ? 2 : 1;
    }
}

// Export global instance
window.zodiacCalendar = new ZodiacCalendar();
