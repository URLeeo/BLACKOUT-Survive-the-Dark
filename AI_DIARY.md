# AI Diary

## AI Tool Used

I used ChatGPT / Codex as my AI coding helper.

## Why I Used It

I used AI to help me plan the project, break the game into smaller steps, and explain JavaScript game logic in a way I could understand. I did not want it to just make a random finished game, so I used it step by step for movement, collision, scoring, screens, restart, and high score.

### 2026-05-25 - Collision bug with the battery

**What I asked the AI:** Help me add a battery and detect when the player touches it.

**What it gave me:** It gave me an AABB collision function and a `Battery` class.

**What was wrong:** At first the player did not have a `getBounds()` method, so the collision function had nothing useful to compare for the player.

**How I fixed it:** I added `getBounds()` to the `Player` class so both the player and battery return `x`, `y`, `width`, and `height`.

**Time lost:** ~10 minutes

### 2026-05-25 - Flashlight position bug

**What I asked the AI:** Make the flashlight follow the player.

**What it gave me:** It updated CSS variables for the flashlight position.

**What was wrong:** The flashlight was following the player's top-left corner instead of the center, so the light looked slightly offset.

**How I fixed it:** I used the player's center position by adding half of the player's size to `x` and `y` before updating `--flashlight-x` and `--flashlight-y`.

**Time lost:** ~8 minutes

### 2026-05-25 - Restart did not reset all state

**What I asked the AI:** Add restart without refreshing the page.

**What it gave me:** A restart button that called the same `start()` method again.

**What was wrong:** Restarting could keep old values if they were not reset inside `start()`. Pressed keys could also stay active if the player was holding a key when the game ended.

**How I fixed it:** I made sure `start()` resets score, battery level, timers, shadows, battery position, difficulty flags, and `this.keys`.

**Time lost:** ~12 minutes

### 2026-05-25 - localStorage high score issue

**What I asked the AI:** Add high score using `localStorage`.

**What it gave me:** Code that loads and saves a high score.

**What was wrong:** Values from `localStorage` are strings, so I needed to convert the saved score back into a number. Also, if the saved value was missing or broken, the game should not display `NaN`.

**How I fixed it:** I used `Number(savedScore) || 0` when loading the high score.

**Time lost:** ~7 minutes

### 2026-05-25 - requestAnimationFrame loop running twice

**What I asked the AI:** Help me organize the game loop using `requestAnimationFrame`.

**What it gave me:** A `gameLoop()` method that keeps calling `requestAnimationFrame`.

**What was wrong:** I realized that if `start()` gets called while a game is already running, another loop could begin. This could make movement, scoring, and battery drain happen too fast.

**How I fixed it:** I made sure the normal flow only calls `start()` from the start screen or game over screen. The `isRunning` flag also stops the loop after game over. A future improvement would be to guard `start()` more strictly if more buttons or menus are added.

**Time lost:** ~15 minutes
