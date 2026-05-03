# React 2048 Game

A browser-based implementation of 2048 with two local suggestion engines: heuristic (basic) and offline AI.

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
- Request-only move suggestion button
- Toggle between Heuristic (Basic) & AI suggestion modes
- Offline AI suggestion (expectimax search), no remote API


## Current Setup
- The game uses a 4x4 board.
- Initial board starts with a random number of `2` tiles.
- A new tile is added only after a valid move changes the board.
- Heuristic (Basic) mode uses a local rule-based evaluator.  _(Old School Style)_
- AI mode uses local expectimax search.
- No credentials are required because no remote AI service is used.


The AI suggestion feature uses a TensorFlow.js model bundled with the app and loaded locally from the public/models directory. No remote API calls or credentials are required.