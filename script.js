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

class Game {
  constructor() {
    this.startButton = document.querySelector("#start-button");
    this.startScreen = document.querySelector("#start-screen");
    this.gameScreen = document.querySelector("#game-screen");
    this.gameContainer = document.querySelector("#game-container");
    this.playerElement = document.querySelector("#player");
    this.batteryElement = document.querySelector("#battery");
    this.scoreElement = document.querySelector("#score");
    this.batteryLevelElement = document.querySelector("#battery-level");

    this.keys = {};
    this.movementKeys = ["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "d", "w", "s"];
    this.lastTime = 0;
    this.isRunning = false;
    this.score = 0;
    this.batteryLevel = 100;
    this.player = new Player(this.playerElement, this.gameContainer);
    this.battery = new Battery(this.batteryElement, this.gameContainer);

    this.addEventListeners();
  }

  addEventListeners() {
    this.startButton.addEventListener("click", () => {
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
    this.gameScreen.classList.remove("hidden");

    this.player.reset();
    this.battery.respawn();
    this.score = 0;
    this.batteryLevel = 100;
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
    this.checkBatteryCollision();

    requestAnimationFrame((time) => this.gameLoop(time));
  }

  checkBatteryCollision() {
    if (this.isColliding(this.player.getBounds(), this.battery.getBounds())) {
      this.score += 10;
      this.batteryLevel = Math.min(this.batteryLevel + 20, 100);
      this.battery.respawn();
      this.updateHud();
    }
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
    this.batteryLevelElement.textContent = this.batteryLevel;
  }
}

const game = new Game();
