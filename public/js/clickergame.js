const Upgrades = require("../models/Upgrades");

let clicks = 0;
let currency = 0;
let clickmultiplier = 1;
let cps = 0;

const clickMeButton = document.getElementById("clickMeButton");
const currencyDisplay = document.getElementById("currency");
const clickCount = document.getElementById("clickCount");

const upgrades = document.getElementById("uprades").value;
function click() {
  clicks += clickmultiplier;
  currency += clickmultiplier;
  currencyDisplay.textContent = currency;
  clickCount.textContent = clicks;
  // syncDataBase();
}

function purchache(upgradeName) {
  const upgrade = Upgrades.findByName({ upgradeName });
}

clickMeButton.addEventListener("click", function () {
  click();
});
/*
function syncDataBase() {
  // Logic to sync the database
};
*/

setInterval(function () {
  clicks += cps;
  currency += cps;
  currencyDisplay.textContent = currency;
  clickCount.textContent = clicks;
}, 1000);
