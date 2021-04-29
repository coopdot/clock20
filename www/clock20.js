// DOM elements
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

// Configuration
const alphabet = "0123456789abcdefghij.";
const rate = 1;

// Main
let tick = 0;
let sec = 0;

// Initialize
const intervalID = window.setInterval((() => {
        const time = new Date();
        yearsE.textContent = time.getFullYear() + "-" + (time.getMonth() + 1);
        daysE.textContent = time.getDate() + " " + time.getHours() + ":" + time.getMinutes();
        secsE.textContent = time.getSeconds();
}),(rate * 1000));
