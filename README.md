# Checkers

A digital adaptation of the classic board game Checkers. This project implements traditional rules and strategies, with a user interface that displays all possible moves.

---

## Note

This project is currently under construction. The functionality to play the game hasn't been implemented yet. This was done in order to start over with a better structured project. Because of this, the only things visible are the board and the settings page.

---

## Demo

Try out the Checkers game by visiting [github.io/99061142/Checkers](https://github.io/99061142/Checkers).

---

## Features

- **Board size:** Choose between 8x8, 10x10, or 12x12 boards.
- **Starting player:** Select whether to play as Player 1 (black stones) or Player 2 (white stones).
- **Game mode:** Currently, only Player vs. Player (PVP) mode is available, with both players being controlled by one user using the same keyboard and computer.

---

## Game Rules

### Mandatory Capture

If a player can capture an opponent's stone, they must do so. Additionally, the player is required to capture the maximum number of stones possible in a single turn.

### Flying King

Kings can move and capture over any distance diagonally.

### Can Move Backwards

Regular stones are allowed to move backwards when no capture is possible.

### Promotion During Capture

A stone is promoted to a king immediately upon reaching the king row, even if it happens in the middle of a capturing sequence.

### Turn Ends on Promotion

When a stone is promoted to a king, its turn ends immediately. It cannot continue to capture additional stones during that turn, even if possible.
