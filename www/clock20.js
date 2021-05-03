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
const alphabet = (() => {
        const candidate = clockE.dataset.alphabet + ".";
        if (candidate.length > 20) return candidate.substring(0,21);
        return "0123456789abcdefghij.";
})();

const rate = (() => { // Widget updates every 'rate' seconds
        const candidate = (input => {
                if (Number.isFinite(Number(input))) return input;

                const fraction = input.match(/^(\d)\/(\d)$/);
                if (fraction !== null) {
                        const quotient = fraction[1] / fraction[2];
                        if (Number.isFinite(quotient)) return quotient;
                }

                return 1;
        })(clockE.dataset.rate);

        if (candidate > 120) return 216;
        if (candidate >  80) return (216 / 2);
        if (candidate >  40) return (216 / 4);

        if (candidate > 8) return (216 / 20);
        if (candidate > 4) return (216 / (2 * 20));

        if (candidate > 2) return (216 / (4 * 20));

        if (candidate <=  1/20) return 1/20;
        if (candidate <=  2/20) return 1/10;
        if (candidate <=  4/20) return 1/5;
        if (candidate <=  5/20) return 1/4;
        if (candidate <= 10/20) return 1/2;

        return 1;
})();

// Known constants:
const quadcentury_days = 146097;     // The number of days in 400 years
const daily_milliseconds = 86400000; // The number of milliseconds in a day

// Time:
const env = {
        quadcentury: 30, // 0 indexed, 30 is the years 2000-2399
        new_quadcentury_date: null,
        new_year_date: null,
        is_leap: null,
        tick: 0,
        sec: 0,
        resetYear() {
                const time = new Date();
                const year = time.getFullYear();

                if (time.getFullYear() < 2000 || time.getFullYear() > 2399) this.quadcentury = Math.floor((time.getFullYear()+10000) / 400);

                this.new_quadcentury_date = Date.UTC((this.quadcentury * 400)-10000, 0, 1);
                this.new_year_date = Date.UTC(year, 0, 1);

                if ((year % 400) === 0)      this.is_leap = true;
                else if ((year % 100) === 0) this.is_leap = false;
                else if ((year % 4) === 0)   this.is_leap = true;
                else this.is_leap = false;
        }
}

const ms_since_quadcentury = (time = null) => {
        if (time === null) time = Date.now();
        return ((time - env.new_quadcentury_date) % (quadcentury_days * daily_milliseconds));
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
const resetClock = (initial = false) => {
        const now = ms_since_quadcentury();
        const day_of_year = Math.floor((
                now - ms_since_quadcentury(env.new_year_date)
        ) / daily_milliseconds);
        const quadcentieth_of_day = Math.floor(now / (daily_milliseconds / 400)) % 400;
        env.sec = Math.floor(now / 1000) % 216;

        let twentieth_of_year = 19;
        while (twentieth_of_year >= 0) {
                if (day_of_year >= first_day_of_twentieth_of_year(twentieth_of_year)) break;
                twentieth_of_year--;
        }

        if (initial === true || (day_of_year === first_day_of_twentieth_of_year(twentieth_of_year && env.sec === 0))) {
                if (twentieth_of_year === 0) env.resetYear();

                const year_of_quadcentury = Math.floor(now / (quadcentury_days * daily_milliseconds) * 400);

                yearsE.textContent =
                        alphabet[Math.floor(env.quadcentury / 20)] +
                        alphabet[(env.quadcentury % 20)] +
                        alphabet[Math.floor(year_of_quadcentury / 20)] +
                        alphabet[(year_of_quadcentury % 20)] +
                        alphabet[20] +
                        alphabet[twentieth_of_year];
        }

        daysE.textContent =
                alphabet[(day_of_year - first_day_of_twentieth_of_year(twentieth_of_year))] +
                alphabet[20] +
                alphabet[Math.floor(quadcentieth_of_day / 20)] +
                alphabet[(quadcentieth_of_day % 20)];
                if (rate > 1 && rate < 20) {
                        const tick = 4 * 20 * env.sec / 216;
                        daysE.textContent = daysE.textContent +
                                alphabet[Math.floor(tick / 4)];
                        if (rate < 5.4) daysE.textContent = daysE.textContent +
                                alphabet[(Math.floor(tick % 4) * 5)];
                }
}

// Initialize:
env.resetYear();
resetClock(true);

const intervalID = window.setInterval((() => {
        if (rate > 1) resetClock();
        else {
                env.tick++;
                env.tick = env.tick % (1/rate);

                secsE.textContent =
                        alphabet[Math.floor(env.sec / 20)] +
                        alphabet[(env.sec % 20)];

                if (rate < 1) {
                        secsE.textContent = secsE.textContent +
                                alphabet[20] +
                                alphabet[env.tick * 20 * rate];
                }

                if (env.tick === 0) env.sec++;
                if ((env.sec % 216) === 0) resetClock();
        }
}),(rate * 1000));
