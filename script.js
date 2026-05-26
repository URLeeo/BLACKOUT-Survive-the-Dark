class Player {
  constructor(element, gameContainer) {
    this.element = element;
    this.gameContainer = gameContainer;
    this.width = 52;
    this.height = 44;
    this.speed = 260;
    this.x = 0;
    this.y = 0;
    this.direction = "down";
  }

  reset() {
    this.x = (this.gameContainer.clientWidth - this.width) / 2;
    this.y = (this.gameContainer.clientHeight - this.height) / 2;
    this.setDirection("down");
    this.updateAnimation(false);
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
    this.updateDirection(moveX, moveY);

    if (moveX !== 0 && moveY !== 0) {
      moveX *= Math.SQRT1_2;
      moveY *= Math.SQRT1_2;
    }

    this.x += moveX * this.speed * deltaTime;
    this.y += moveY * this.speed * deltaTime;
    this.keepInsideGameArea();
    this.updateElement();
    this.updateAnimation(moveX !== 0 || moveY !== 0);

    return moveX !== 0 || moveY !== 0;
  }

  keepInsideGameArea() {
    const maxX = this.gameContainer.clientWidth - this.width;
    const maxY = this.gameContainer.clientHeight - this.height;

    this.x = Math.max(0, Math.min(this.x, maxX));
    this.y = Math.max(0, Math.min(this.y, maxY));
  }

  updateElement() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.transform = "none";

    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;

    this.gameContainer.style.setProperty("--flashlight-x", `${centerX}px`);
    this.gameContainer.style.setProperty("--flashlight-y", `${centerY}px`);
  }

  updateAnimation(isMoving) {
    this.element.classList.toggle("moving", isMoving);
  }

  updateDirection(moveX, moveY) {
    if (moveX === 0 && moveY === 0) {
      return;
    }

    if (Math.abs(moveX) > Math.abs(moveY)) {
      this.setDirection(moveX > 0 ? "right" : "left");
    } else {
      this.setDirection(moveY > 0 ? "down" : "up");
    }
  }

  setDirection(direction) {
    this.direction = direction;
    this.element.classList.remove("direction-left", "direction-right", "direction-up", "direction-down");
    this.element.classList.add(`direction-${direction}`);
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

class Battery {
  constructor(element, gameContainer) {
    this.element = element;
    this.gameContainer = gameContainer;
    this.width = 42;
    this.height = 26;
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

class Heart {
  constructor(element, gameContainer) {
    this.element = element;
    this.gameContainer = gameContainer;
    this.width = 32;
    this.height = 32;
    this.x = 0;
    this.y = 0;
    this.isActive = false;
  }

  spawn() {
    const maxX = this.gameContainer.clientWidth - this.width;
    const maxY = this.gameContainer.clientHeight - this.height;

    this.x = Math.random() * maxX;
    this.y = Math.random() * maxY;
    this.isActive = true;
    this.element.classList.remove("hidden");
    this.updateElement();
  }

  hide() {
    this.isActive = false;
    this.element.classList.add("hidden");
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
    this.width = 72;
    this.height = 62;
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
    const maxX = this.gameContainer.clientWidth - this.width;
    const maxY = this.gameContainer.clientHeight - this.height;

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
      width: this.width,
      height: this.height
    };
  }
}

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.isReady = false;
  }

  resume() {
    if (!this.audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;

      if (!AudioContextClass) {
        return;
      }

      this.audioContext = new AudioContextClass();
    }

    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    this.isReady = true;
  }

  playTone(frequency, duration, type, volume, endFrequency) {
    if (!this.isReady || !this.audioContext) {
      return;
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);

    if (endFrequency) {
      oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    }

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    oscillator.connect(gain);
    gain.connect(this.audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + duration);
  }

  playStart() {
    this.playTone(220, 0.12, "square", 0.05, 440);
    setTimeout(() => this.playTone(330, 0.12, "square", 0.04, 660), 90);
  }

  playBattery() {
    this.playTone(540, 0.08, "square", 0.05, 760);
    setTimeout(() => this.playTone(820, 0.1, "square", 0.04, 1100), 70);
  }

  playShadowSpawn() {
    this.playTone(130, 0.25, "sawtooth", 0.035, 70);
  }

  playGameOver() {
    this.playTone(180, 0.35, "triangle", 0.06, 60);
    setTimeout(() => this.playTone(90, 0.45, "sawtooth", 0.035, 45), 160);
  }

  playWarning() {
    this.playTone(260, 0.08, "square", 0.025, 220);
  }

  playEnemyNear() {
    this.playTone(210, 0.12, "sine", 0.025, 160);
  }

  playStep() {
    this.playTone(155, 0.055, "sine", 0.009, 120);
    setTimeout(() => this.playTone(95, 0.05, "triangle", 0.008, 75), 35);
  }

  playReveal() {
    this.playTone(360, 0.1, "sawtooth", 0.035, 190);
    setTimeout(() => this.playTone(500, 0.08, "square", 0.025, 300), 90);
  }

  playSkill() {
    this.playTone(220, 0.12, "square", 0.05, 440);
    setTimeout(() => this.playTone(440, 0.14, "square", 0.045, 880), 90);
    setTimeout(() => this.playTone(880, 0.16, "triangle", 0.04, 1320), 180);
  }

  playHeal() {
    this.playTone(420, 0.1, "sine", 0.035, 620);
    setTimeout(() => this.playTone(620, 0.12, "sine", 0.03, 840), 90);
  }

  playHit() {
    this.playTone(170, 0.16, "sawtooth", 0.04, 90);
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
    this.flashlightElement = document.querySelector("#flashlight");
    this.playerElement = document.querySelector("#player");
    this.batteryElement = document.querySelector("#battery");
    this.heartElement = document.querySelector("#heart");
    this.scoreElement = document.querySelector("#score");
    this.batteryLevelElement = document.querySelector("#battery-level");
    this.healthDisplayElement = document.querySelector("#health-display");
    this.spawnTimerElement = document.querySelector("#spawn-timer");
    this.revealCounterElement = document.querySelector("#reveal-counter");
    this.skillCounterElement = document.querySelector("#skill-counter");
    this.highScoreElement = document.querySelector("#high-score");
    this.finalScoreElement = document.querySelector("#final-score");
    this.gameOverHighScoreElement = document.querySelector("#game-over-high-score");
    this.loseReasonElement = document.querySelector("#lose-reason");

    this.keys = {};
    this.movementKeys = ["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "d", "w", "s"];
    this.highScoreKey = "blackoutHighScore";
    this.lastTime = 0;
    this.isRunning = false;
    this.score = 0;
    this.batteryLevel = 100;
    this.maxHealth = 3;
    this.health = 1;
    this.highScore = this.loadHighScore();
    this.survivalTimer = 0;
    this.scoreTimer = 0;
    this.batteryDrainRate = 8;
    this.shadows = [];
    this.secondShadowAdded = false;
    this.thirdShadowAdded = false;
    this.shadowSpeedIncreased = false;
    this.lowBatterySoundTimer = 0;
    this.walkSoundTimer = 0;
    this.batteryPickupCount = 0;
    this.skillPickupCount = 0;
    this.skillBatteryGoal = 5;
    this.skillReady = false;
    this.skillActive = false;
    this.skillTimeLeft = 0;
    this.enemyAlertDistance = 145;
    this.enemyAlertSoundTimer = 0;
    this.enemyWasClose = false;
    this.hitInvulnerableTime = 0;
    this.sound = new SoundManager();
    this.player = new Player(this.playerElement, this.gameContainer);
    this.battery = new Battery(this.batteryElement, this.gameContainer);
    this.heart = new Heart(this.heartElement, this.gameContainer);

    this.addEventListeners();
    this.updateHud();
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

      if (this.movementKeys.includes(key) || event.code === "Space") {
        event.preventDefault();
      }

      if (event.code === "Space" && !event.repeat) {
        this.useSkill();
      }

      this.keys[key] = true;
    });

    window.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      this.keys[key] = false;
    });
  }

  start() {
    if (this.isRunning) {
      return;
    }

    this.sound.resume();
    this.sound.playStart();
    this.startScreen.classList.add("hidden");
    this.gameOverScreen.classList.add("hidden");
    this.gameScreen.classList.remove("hidden");

    this.player.reset();
    this.battery.respawn();
    this.keys = {};
    this.score = 0;
    this.batteryLevel = 100;
    this.health = 1;
    this.survivalTimer = 0;
    this.scoreTimer = 0;
    this.lowBatterySoundTimer = 0;
    this.walkSoundTimer = 0;
    this.batteryPickupCount = 0;
    this.skillPickupCount = 0;
    this.skillReady = false;
    this.skillActive = false;
    this.skillTimeLeft = 0;
    this.enemyAlertSoundTimer = 0;
    this.enemyWasClose = false;
    this.hitInvulnerableTime = 0;
    this.heart.hide();
    this.playerElement.classList.remove("hurt");
    this.secondShadowAdded = false;
    this.thirdShadowAdded = false;
    this.shadowSpeedIncreased = false;
    this.flashlightElement.classList.remove("danger", "overpowered");
    this.gameContainer.classList.remove("overpowered");
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

    const playerIsMoving = this.player.move(this.keys, deltaTime);
    this.updateWalkingSound(playerIsMoving, deltaTime);
    this.moveShadows(deltaTime);
    this.checkBatteryCollision();
    this.checkHeartCollision();
    this.checkShadowCollision();

    if (!this.isRunning) {
      return;
    }

    this.updateSurvivalScore(deltaTime);
    this.updateDifficulty();
    this.updateSkill(deltaTime);
    this.updateInvulnerability(deltaTime);
    this.updateEnemyAlert(deltaTime);
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
      this.batteryPickupCount += 1;
      this.skillPickupCount += 1;
      this.battery.respawn();
      this.trySpawnHeart();
      this.sound.playBattery();

      if (this.batteryPickupCount % 3 === 0) {
        this.revealShadows();
      }

      if (this.skillPickupCount >= this.skillBatteryGoal) {
        this.skillReady = true;
        this.skillPickupCount = this.skillBatteryGoal;
      }

      this.updateHud();
    }
  }

  checkShadowCollision() {
    if (this.hitInvulnerableTime > 0 || this.skillActive) {
      return;
    }

    for (const shadow of this.shadows) {
      if (this.isColliding(this.player.getBounds(), shadow.getBounds())) {
        this.takeDamage();
        return;
      }
    }
  }

  checkHeartCollision() {
    if (!this.heart.isActive) {
      return;
    }

    if (this.isColliding(this.player.getBounds(), this.heart.getBounds())) {
      this.health = Math.min(this.health + 1, this.maxHealth);
      this.heart.hide();
      this.sound.playHeal();
      this.updateHud();
    }
  }

  trySpawnHeart() {
    if (this.heart.isActive || this.health >= this.maxHealth) {
      return;
    }

    if (Math.random() < 0.18) {
      this.heart.spawn();
    }
  }

  takeDamage() {
    this.health -= 1;
    this.hitInvulnerableTime = 1.4;
    this.playerElement.classList.add("hurt");
    this.sound.playHit();

    if (this.health <= 0) {
      this.health = 0;
      this.endGame("The shadows drained your health.");
      return;
    }

    this.updateHud();
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
    this.sound.playShadowSpawn();
  }

  revealShadows() {
    this.sound.playReveal();

    for (const shadow of this.shadows) {
      shadow.element.classList.add("revealed");

      setTimeout(() => {
        shadow.element.classList.remove("revealed");
      }, 2200);
    }
  }

  useSkill() {
    if (!this.isRunning || !this.skillReady || this.skillActive) {
      return;
    }

    this.skillReady = false;
    this.skillActive = true;
    this.skillTimeLeft = 5;
    this.skillPickupCount = 0;
    this.flashlightElement.classList.add("overpowered");
    this.flashlightElement.classList.remove("danger");
    this.gameContainer.classList.add("overpowered");
    this.revealShadows();
    this.sound.playSkill();
    this.updateHud();
  }

  updateSkill(deltaTime) {
    if (!this.skillActive) {
      return;
    }

    this.skillTimeLeft -= deltaTime;

    if (this.skillTimeLeft <= 0) {
      this.skillActive = false;
      this.skillTimeLeft = 0;
      this.flashlightElement.classList.remove("overpowered");
      this.gameContainer.classList.remove("overpowered");
    }

    this.updateHud();
  }

  updateInvulnerability(deltaTime) {
    if (this.hitInvulnerableTime <= 0) {
      return;
    }

    this.hitInvulnerableTime -= deltaTime;

    if (this.hitInvulnerableTime <= 0) {
      this.hitInvulnerableTime = 0;
      this.playerElement.classList.remove("hurt");
    }
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

    if (this.survivalTimer >= 60 && !this.thirdShadowAdded) {
      this.addShadow(60, this.gameContainer.clientHeight - 100, 145, -115);
      this.thirdShadowAdded = true;
    }

    if (this.survivalTimer >= 90 && !this.shadowSpeedIncreased) {
      for (const shadow of this.shadows) {
        shadow.setSpeedMultiplier(1.35);
      }

      this.shadowSpeedIncreased = true;
    }
  }

  drainBattery(deltaTime) {
    this.batteryLevel -= this.batteryDrainRate * deltaTime;
    this.batteryLevel = Math.max(this.batteryLevel, 0);
    this.playLowBatteryWarning(deltaTime);
    this.updateHud();
  }

  updateWalkingSound(isMoving, deltaTime) {
    if (!isMoving) {
      this.walkSoundTimer = 0;
      return;
    }

    this.walkSoundTimer += deltaTime;

    if (this.walkSoundTimer >= 0.24) {
      this.sound.playStep();
      this.walkSoundTimer = 0;
    }
  }

  updateEnemyAlert(deltaTime) {
    if (this.skillActive) {
      this.flashlightElement.classList.remove("danger");
      this.enemyAlertSoundTimer = 0;
      this.enemyWasClose = false;
      return;
    }

    const playerBounds = this.player.getBounds();
    const playerCenterX = playerBounds.x + playerBounds.width / 2;
    const playerCenterY = playerBounds.y + playerBounds.height / 2;
    let enemyIsClose = false;

    for (const shadow of this.shadows) {
      const shadowBounds = shadow.getBounds();
      const shadowCenterX = shadowBounds.x + shadowBounds.width / 2;
      const shadowCenterY = shadowBounds.y + shadowBounds.height / 2;
      const distance = Math.hypot(playerCenterX - shadowCenterX, playerCenterY - shadowCenterY);

      if (distance <= this.enemyAlertDistance) {
        enemyIsClose = true;
        break;
      }
    }

    this.flashlightElement.classList.toggle("danger", enemyIsClose);

    if (!enemyIsClose) {
      this.enemyAlertSoundTimer = 0;
      this.enemyWasClose = false;
      return;
    }

    if (!this.enemyWasClose) {
      this.sound.playEnemyNear();
      this.enemyWasClose = true;
    }

    this.enemyAlertSoundTimer += deltaTime;

    if (this.enemyAlertSoundTimer >= 1.15) {
      this.sound.playEnemyNear();
      this.enemyAlertSoundTimer = 0;
    }
  }

  playLowBatteryWarning(deltaTime) {
    if (this.batteryLevel > 25) {
      this.lowBatterySoundTimer = 0;
      return;
    }

    this.lowBatterySoundTimer += deltaTime;

    if (this.lowBatterySoundTimer >= 3) {
      this.sound.playWarning();
      this.lowBatterySoundTimer = 0;
    }
  }

  endGame(reason) {
    this.isRunning = false;
    this.flashlightElement.classList.remove("danger", "overpowered");
    this.gameContainer.classList.remove("overpowered");
    this.sound.playGameOver();
    this.updateHighScore();
    this.loseReasonElement.textContent = reason;
    this.finalScoreElement.textContent = this.score;
    this.gameOverHighScoreElement.textContent = this.highScore;
    this.gameScreen.classList.add("hidden");
    this.gameOverScreen.classList.remove("hidden");
    this.updateHud();
  }

  loadHighScore() {
    const savedScore = localStorage.getItem(this.highScoreKey);

    if (savedScore === null) {
      return 0;
    }

    return Number(savedScore) || 0;
  }

  updateHighScore() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem(this.highScoreKey, this.highScore);
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
    this.batteryLevelElement.textContent = Math.ceil(this.batteryLevel);
    this.healthDisplayElement.textContent = `${this.health}/${this.maxHealth}`;
    this.updateSpawnTimer();
    this.updateRevealCounter();
    this.updateSkillCounter();
    this.highScoreElement.textContent = this.highScore;
  }

  updateRevealCounter() {
    const batteriesLeft = 3 - (this.batteryPickupCount % 3);

    this.revealCounterElement.textContent = `${batteriesLeft} more`;
  }

  updateSkillCounter() {
    if (this.skillActive) {
      this.skillCounterElement.textContent = `${Math.ceil(this.skillTimeLeft)}s boost`;
      return;
    }

    if (this.skillReady) {
      this.skillCounterElement.textContent = "Ready: Space";
      return;
    }

    const batteriesLeft = this.skillBatteryGoal - this.skillPickupCount;
    this.skillCounterElement.textContent = `${batteriesLeft} more`;
  }

  updateSpawnTimer() {
    if (!this.secondShadowAdded) {
      const timeLeft = Math.max(0, Math.ceil(30 - this.survivalTimer));

      this.spawnTimerElement.textContent = `${timeLeft}s`;
      this.spawnTimerElement.classList.toggle("spawn-warning", timeLeft <= 5);
      return;
    }

    if (!this.thirdShadowAdded) {
      const timeLeft = Math.max(0, Math.ceil(60 - this.survivalTimer));

      this.spawnTimerElement.textContent = `3rd in ${timeLeft}s`;
      this.spawnTimerElement.classList.toggle("spawn-warning", timeLeft <= 5);
      return;
    }

    if (!this.shadowSpeedIncreased) {
      const timeLeft = Math.max(0, Math.ceil(90 - this.survivalTimer));

      this.spawnTimerElement.textContent = `speed in ${timeLeft}s`;
      this.spawnTimerElement.classList.toggle("spawn-warning", timeLeft <= 5);
      return;
    }

    this.spawnTimerElement.textContent = "active";
    this.spawnTimerElement.classList.remove("spawn-warning");
  }
}

const game = new Game();
