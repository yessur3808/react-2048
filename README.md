# React 2048 Game

A browser-based implementation of 2048 with offline AI move suggestion.

## Tech Stack

- React
- TypeScript
- Vite
- Vitest

## Running Locally

```
npm install
npm run dev
```


## Running Tests

```
npm test
```
## Features

- Random initial board generation
- Move left, right, up, and down
- Adds a 2 or 4 after each valid move
- Win detection at 2048
- Loss detection when no moves are available
- Offline AI move suggestion

## Assumptions

- The game uses a 4x4 board.
- Initial board starts with a random number of `2` tiles.
- A new tile is added only after a valid move changes the board.
- The AI suggestion uses a local heuristic evaluator rather than a remote model.