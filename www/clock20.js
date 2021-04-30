// DOM elements:
const clockE = document.getElementById("clock20");
const yearsE = document.createElement("p");
const daysE = document.createElement("p");
const secsE = document.createElement("p");

yearsE.id = "clock20y";
daysE.id = "clock20d";
secsE.id = "clock20s";

clockE.append(yearsE);
clockE.append(daysE);
clockE.append(secsE);

// Configuration:
const alphabet = "0123456789abcdefghij.";
const rate = 1; // Widget updates every 'rate' seconds

// Known constants:
const quadcentury_days = 146097;     // The number of days in 400 years
const daily_milliseconds = 86400000; // The number of milliseconds in a day

// Time:
const env = {
        y2k_date: null,
        new_year_date: null,
        is_leap: null,
        tick: 0,
        sec: 0,
        resetYear() {
                const time = new Date();
                const year = time.getFullYear();

                this.y2k_date = Date.UTC(2000,0,1);
                this.new_year_date = Date.UTC(year,0,1);

                if ((year % 400) === 0)      this.is_leap = true;
                else if ((year % 100) === 0) this.is_leap = false;
                else if ((year % 4) === 0)   this.is_leap = true;
                else this.is_leap = false;
        }
}

const ms_since_y2k = (time = null) => {
        if (time === null) time = Date.now();
        return ((time - env.y2k_date) % (quadcentury_days * daily_milliseconds));
}

// Utilities:
const first_day_of_twentieth_of_year = (twentieth_of_year) => {
        for (let i = 4; i >= 0; i--) {
                if (twentieth_of_year > (i * 4)) {
                        if (env.is_leap && twentieth_of_year > 2) {
                                // Febuary 25 is the leap day in this calendar
                                // 19+12+19 = 55 = 31+25
                                return (twentieth_of_year * 18 + i + 2);
                        }
                        return (twentieth_of_year * 18 + i + 1);
                }
        }
        return 0;
}

// Moving parts:
const updateY = (twentieth_of_year) => {
        if (twentieth_of_year === 0) env.resetYear();
        const time = new Date();
        const rawY = (time.getFullYear());
        yearsE.textContent = (rawY+10000) + "-" + twentieth_of_year;
}

const resetClock = (initial = false) => {
        const now = ms_since_y2k();
        const day_of_year = Math.floor((
                now - ms_since_y2k(env.new_year_date)
        ) / daily_milliseconds);
        const quadcentieth_of_day = Math.floor(now / (daily_milliseconds / 400)) % 400;
        env.sec = Math.floor(now / 1000) % 216;

        let twentieth_of_year = 19;
        while (twentieth_of_year >= 0) {
                if (day_of_year >= first_day_of_twentieth_of_year(twentieth_of_year)) break;
                twentieth_of_year--;
        }

        if (initial === true || (day_of_year === first_day_of_twentieth_of_year(twentieth_of_year && env.sec === 0))) updateY(twentieth_of_year);

        daysE.textContent = (day_of_year - first_day_of_twentieth_of_year(twentieth_of_year)) + " " + quadcentieth_of_day;
}

// Initialize:
env.resetYear();
resetClock(true);

const intervalID = window.setInterval((() => {
        env.sec++;
        if ((env.sec % 216) === 0) resetClock();
        secsE.textContent = env.sec;
}),(rate * 1000));
