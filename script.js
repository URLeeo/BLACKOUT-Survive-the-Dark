class Player {
  constructor(element, gameContainer) {
    this.element = element;
    this.gameContainer = gameContainer;
    this.size = 24;
    this.speed = 260;
    this.x = 0;
    this.y = 0;
  }

  reset() {
    this.x = (this.gameContainer.clientWidth - this.size) / 2;
    this.y = (this.gameContainer.clientHeight - this.size) / 2;
    this.updateElement();
  }

  move(keys, deltaTime) {
    let moveX = 0;
    let moveY = 0;

    if (keys.arrowleft || keys.a) {
      moveX -= 1;
    }

    if (keys.arrowright || keys.d) {
      moveX += 1;
    }

    if (keys.arrowup || keys.w) {
      moveY -= 1;
    }

    if (keys.arrowdown || keys.s) {
      moveY += 1;
    }

    // Normalize diagonal movement so it is not faster than straight movement.
    if (moveX !== 0 && moveY !== 0) {
      moveX *= Math.SQRT1_2;
      moveY *= Math.SQRT1_2;
    }

    this.x += moveX * this.speed * deltaTime;
    this.y += moveY * this.speed * deltaTime;
    this.keepInsideGameArea();
    this.updateElement();
  }

  keepInsideGameArea() {
    const maxX = this.gameContainer.clientWidth - this.size;
    const maxY = this.gameContainer.clientHeight - this.size;

    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
  }

  updateElement() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.transform = "none";

    const centerX = this.x + this.size / 2;
    const centerY = this.y + this.size / 2;

    this.gameContainer.style.setProperty("--flashlight-x", `${centerX}px`);
    this.gameContainer.style.setProperty("--flashlight-y", `${centerY}px`);
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size
    };
  }
}

class Battery {
  constructor(element, gameContainer) {
    this.element = element;
    this.gameContainer = gameContainer;
    this.width = 18;
    this.height = 28;
    this.x = 0;
    this.y = 0;
  }

  respawn() {
    const maxX = this.gameContainer.clientWidth - this.width;
    const maxY = this.gameContainer.clientHeight - this.height;

    this.x = Math.random() * maxX;
    this.y = Math.random() * maxY;
    this.updateElement();
  }

  updateElement() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}

class Shadow {
  constructor(gameContainer, x, y, speedX, speedY) {
    this.gameContainer = gameContainer;
    this.size = 34;
    this.x = x;
    this.y = y;
    this.speedX = speedX;
    this.speedY = speedY;
    this.speedMultiplier = 1;
    this.element = document.createElement("div");

    this.element.classList.add("shadow");
    this.gameContainer.appendChild(this.element);
    this.updateElement();
  }

  move(deltaTime) {
    this.x += this.speedX * this.speedMultiplier * deltaTime;
    this.y += this.speedY * this.speedMultiplier * deltaTime;
    this.bounceFromEdges();
    this.updateElement();
  }

  bounceFromEdges() {
    const maxX = this.gameContainer.clientWidth - this.size;
    const maxY = this.gameContainer.clientHeight - this.size;

    if (this.x <= 0 || this.x >= maxX) {
      this.speedX *= -1;
      this.x = Math.max(0, Math.min(this.x, maxX));
    }

    if (this.y <= 0 || this.y >= maxY) {
      this.speedY *= -1;
      this.y = Math.max(0, Math.min(this.y, maxY));
    }
  }

  setSpeedMultiplier(multiplier) {
    this.speedMultiplier = multiplier;
  }

  updateElement() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }

  remove() {
    this.element.remove();
  }

  getBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.size,
      height: this.size
    };
  }
}

class Game {
  constructor() {
    this.startButton = document.querySelector("#start-button");
    this.restartButton = document.querySelector("#restart-button");
    this.startScreen = document.querySelector("#start-screen");
    this.gameScreen = document.querySelector("#game-screen");
    this.gameOverScreen = document.querySelector("#game-over-screen");
    this.gameContainer = document.querySelector("#game-container");
    this.playerElement = document.querySelector("#player");
    this.batteryElement = document.querySelector("#battery");
    this.scoreElement = document.querySelector("#score");
    this.batteryLevelElement = document.querySelector("#battery-level");
    this.highScoreElement = document.querySelector("#high-score");
    this.finalScoreElement = document.querySelector("#final-score");
    this.gameOverHighScoreElement = document.querySelector("#game-over-high-score");
    this.loseReasonElement = document.querySelector("#lose-reason");

    this.keys = {};
    this.movementKeys = ["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "d", "w", "s"];
    this.lastTime = 0;
    this.isRunning = false;
    this.score = 0;
    this.batteryLevel = 100;
    this.highScore = 0;
    this.survivalTimer = 0;
    this.scoreTimer = 0;
    this.batteryDrainRate = 8;
    this.shadows = [];
    this.secondShadowAdded = false;
    this.shadowSpeedIncreased = false;
    this.player = new Player(this.playerElement, this.gameContainer);
    this.battery = new Battery(this.batteryElement, this.gameContainer);

    this.addEventListeners();
  }

  addEventListeners() {
    this.startButton.addEventListener("click", () => {
      this.start();
    });

    this.restartButton.addEventListener("click", () => {
      this.start();
    });

    window.addEventListener("keydown", (event) => {
      const key = event.key.toLowerCase();

      if (this.movementKeys.includes(key)) {
        event.preventDefault();
      }

      this.keys[key] = true;
    });

    window.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      this.keys[key] = false;
    });
  }

  start() {
    this.startScreen.classList.add("hidden");
    this.gameOverScreen.classList.add("hidden");
    this.gameScreen.classList.remove("hidden");

    this.player.reset();
    this.battery.respawn();
    this.keys = {};
    this.score = 0;
    this.batteryLevel = 100;
    this.survivalTimer = 0;
    this.scoreTimer = 0;
    this.secondShadowAdded = false;
    this.shadowSpeedIncreased = false;
    this.resetShadows();
    this.addShadow(40, 40, 120, 95);
    this.updateHud();
    this.lastTime = performance.now();
    this.isRunning = true;
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  gameLoop(currentTime) {
    if (!this.isRunning) {
      return;
    }

    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.player.move(this.keys, deltaTime);
    this.moveShadows(deltaTime);
    this.checkBatteryCollision();
    this.checkShadowCollision();

    if (!this.isRunning) {
      return;
    }

    this.updateSurvivalScore(deltaTime);
    this.updateDifficulty();
    this.drainBattery(deltaTime);

    if (this.batteryLevel <= 0) {
      this.endGame("The flashlight battery died.");
      return;
    }

    requestAnimationFrame((time) => this.gameLoop(time));
  }

  checkBatteryCollision() {
    if (this.isColliding(this.player.getBounds(), this.battery.getBounds())) {
      this.score += 10;
      this.batteryLevel = Math.min(this.batteryLevel + 25, 100);
      this.battery.respawn();
      this.updateHud();
    }
  }

  checkShadowCollision() {
    for (const shadow of this.shadows) {
      if (this.isColliding(this.player.getBounds(), shadow.getBounds())) {
        this.endGame("A shadow caught you.");
        return;
      }
    }
  }

  moveShadows(deltaTime) {
    for (const shadow of this.shadows) {
      shadow.move(deltaTime);
    }
  }

  resetShadows() {
    for (const shadow of this.shadows) {
      shadow.remove();
    }

    this.shadows = [];
  }

  addShadow(x, y, speedX, speedY) {
    const shadow = new Shadow(this.gameContainer, x, y, speedX, speedY);

    if (this.shadowSpeedIncreased) {
      shadow.setSpeedMultiplier(1.35);
    }

    this.shadows.push(shadow);
  }

  updateSurvivalScore(deltaTime) {
    this.survivalTimer += deltaTime;
    this.scoreTimer += deltaTime;

    while (this.scoreTimer >= 1) {
      this.score += 1;
      this.scoreTimer -= 1;
      this.updateHud();
    }
  }

  updateDifficulty() {
    if (this.survivalTimer >= 30 && !this.secondShadowAdded) {
      this.addShadow(this.gameContainer.clientWidth - 80, this.gameContainer.clientHeight - 80, -105, 130);
      this.secondShadowAdded = true;
    }

    if (this.survivalTimer >= 60 && !this.shadowSpeedIncreased) {
      for (const shadow of this.shadows) {
        shadow.setSpeedMultiplier(1.35);
      }

      this.shadowSpeedIncreased = true;
    }
  }

  drainBattery(deltaTime) {
    this.batteryLevel -= this.batteryDrainRate * deltaTime;
    this.batteryLevel = Math.max(this.batteryLevel, 0);
    this.updateHud();
  }

  endGame(reason) {
    this.isRunning = false;
    this.loseReasonElement.textContent = reason;
    this.finalScoreElement.textContent = this.score;
    this.gameOverHighScoreElement.textContent = this.highScore;
    this.gameScreen.classList.add("hidden");
    this.gameOverScreen.classList.remove("hidden");
    this.updateHud();
  }

  isColliding(firstBox, secondBox) {
    return (
      firstBox.x < secondBox.x + secondBox.width &&
      firstBox.x + firstBox.width > secondBox.x &&
      firstBox.y < secondBox.y + secondBox.height &&
      firstBox.y + firstBox.height > secondBox.y
    );
  }

  updateHud() {
    this.scoreElement.textContent = this.score;
    this.batteryLevelElement.textContent = Math.ceil(this.batteryLevel);
    this.highScoreElement.textContent = this.highScore;
  }
}

const game = new Game();
