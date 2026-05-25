const startButton = document.querySelector("#start-button");
const startScreen = document.querySelector("#start-screen");
const gameScreen = document.querySelector("#game-screen");

// This button only shows the game screen for now.
// The real game loop will be added in the next steps.
startButton.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
});
