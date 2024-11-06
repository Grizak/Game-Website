const guessInput = document.getElementById("guessInput");
const guessButton = document.getElementById("guessButton");
const feedback = document.getElementById("feedback");

const randomNumber = Math.floor(Math.random() * 100) + 1;
let guessesLeft = parseInt(prompt("How many guesses do you want? (15)")) || 15;
const guesses = guessesLeft;

if (isNaN(guessesLeft)) {
  console.log(guessesLeft);
  location.reload();
}

guessButton.addEventListener("click", () => {
  Guess();
});

guessInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    Guess();
  }
});

function Guess() {
  const guess = parseInt(guessInput.value);

  if (isNaN(guess) || guess < 1 || guess > 100) {
    feedback.textContent = "Please enter a valid number between 1 and 100.";
    location.reload();
  }

  guessesLeft--;

  if (guess === randomNumber) {
    feedback.textContent = `Congratulations! You guessed it in ${guesses - guessesLeft} tries.`;
    guessButton.disabled = true; // Disable the button after winning
  } else if (guessesLeft === 0) {
    feedback.textContent = `You ran out of guesses! The number was ${randomNumber}.`;
    guessButton.disabled = true; // Disable the button after losing
  } else if (guess < randomNumber) {
    feedback.textContent = "Too low! Try again.";
  } else if (guess > randomNumber) {
    feedback.textContent = "Too high! Try again.";
  }

  guessInput.value = ""; // Clear the input field
}

function resetGame() {
  guessesLeft = guesses;
  guessButton.disabled = false; // Enable the button again
  feedback.textContent = "Guess a number between 1 and 100.";
  guessInput.value = ""; // Clear the input field
}
