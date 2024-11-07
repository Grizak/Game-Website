let clicks = 0;
let currency = 0;
let clickmultiplier = 1;
let cps = 0;
let boughtUpgrades = [];

let Upgrades = [];

function fetchupgrades() {
  Upgrades = [];
  fetch("/api/upgrades")
    .then((res) => res.json())
    .then((data) => {
      Upgrades = data;
    });
}

const clickMeButton = document.getElementById("clickMeButton");
const currencyDisplay = document.getElementById("currency");
const clickCount = document.getElementById("clickCount");

function click() {
  clicks += clickmultiplier;
  currency += clickmultiplier;
  currencyDisplay.textContent = currency;
  clickCount.textContent = clicks;
  // syncDataBase();
}

function purchache(upgradeName) {
  const upgrade = Upgrades.findByName({ upgradeName });
  if (currency >= upgrade.price) {
    return;
  }

  currency -= upgrade.price;
  boughtUpgrades.push(upgrade);
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
