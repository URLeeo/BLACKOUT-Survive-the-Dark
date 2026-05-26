# BLACKOUT: Survive the Dark

## Description

BLACKOUT is a top-down survival browser game made with HTML, CSS, and vanilla JavaScript.

The player is trapped in a dark building during a blackout. The only safe area is the small flashlight circle around the player. The flashlight battery slowly drains, so the player has to collect batteries, avoid shadow enemies, and survive for as long as possible.

## Excalidraw Drawing Placeholder

This section is for my Excalidraw sketch.

```text
+--------------------------------------------------+
| BLACKOUT: Survive the Dark                       |
| Score: 42        Battery: 76%      High: 120     |
+--------------------------------------------------+
|                                                  |
|                  dark game area                  |
|                                                  |
|                         shadow                   |
|                                                  |
|             flashlight circle                    |
|                    +-----+                       |
|                    |  P  |        battery        |
|                    +-----+                       |
|                                                  |
|        shadow                                    |
|                                                  |
+--------------------------------------------------+
```

## Entities

- `Game` - controls the game loop, score, battery drain, screens, and difficulty.
- `Player` - stores the player's position and handles movement.
- `Battery` - appears randomly and can be collected by the player.
- `Shadow` - moves around the game area and ends the game on collision.

## How to Play

1. Open `index.html` in a browser.
2. Click `Start Game`.
3. Move around the dark area.
4. Collect batteries before the flashlight reaches 0%.
5. Avoid the shadows.
6. Try to beat your high score.

## Controls

- `W` or `Arrow Up` - move up
- `A` or `Arrow Left` - move left
- `S` or `Arrow Down` - move down
- `D` or `Arrow Right` - move right
- `Space` - use overpowered flashlight skill when it is ready

## Objective

Survive as long as possible while keeping the flashlight battery alive.

## Win / Lose Condition

There is no final win screen because this is a survival game. The goal is to last as long as possible.

You lose if:

- the flashlight battery reaches `0%`
- a shadow enemy touches the player

## Score System

- `+1` score for every second survived
- `+10` score for collecting a battery
- High score is saved with `localStorage`
- Every 3 batteries briefly reveals the shadows
- Every 5 batteries unlocks the overpowered flashlight skill
- Player starts with `1/3` health
- Rare hearts can restore health up to `3/3`

Planned score feature:

- `+25` bonus every 30 seconds survived

## Tech Decisions

I used object-oriented programming for this project instead of only using functions.

I chose OOP because each game object has its own state and behavior:

- the player has position, speed, movement, and bounds
- the battery has position and respawn behavior
- each shadow has position, speed, bouncing, and collision bounds
- the game manages the loop, score, battery level, screens, and difficulty

This made the code easier for me to organize because each class has one clear job. A functional style could also work, but for this game OOP felt more natural because the project is built around separate entities.

## AI Diary

See [AI_DIARY.md](AI_DIARY.md).

## GitHub Pages

GitHub Pages link placeholder:

`https://your-username.github.io/blackout-game/`

## Known Bugs / Future Improvements

- Add the `+25` bonus every 30 seconds.
- Add better wall or room shapes.
- Add a pause button.
- Make shadow spawn positions safer so they do not appear too close to the player.
- Tune heart spawn chance after playtesting.
- Improve mobile support.

## Commit Milestones

- `feat: player movement`
- `feat: collission implemented`
- `feat: add score/lose`
- `feat: start & game over screen`
- `feat: game restart`
- `feat: high score`
