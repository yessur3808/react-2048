# React-2048

2048 game built with React and TypeScript, including keyboard controls, game-state detection, and offline AI move suggestions.


![react-2048 screenshot](public/Screenshot.png)

## Tech Stack

- React
- TypeScript
- Vite
- Vitest

## Getting Started

### Requirements

- Node.js 18+
- npm 9+

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Then open the local Vite URL shown in your terminal (usually `http://localhost:5173`).

### 3. Run tests

```bash
npm run test:run
```

For watch mode:

```bash
npm test
```

### 4. Build for production

```bash
npm run build
```

## AI Model Prerequisites

Offline AI suggestions require local model files at:

- `public/models/2048/model.json`
- `public/models/2048/*.bin`

If these files are missing, the game still runs normally, but AI suggestions will not be available. See `public/models/2048/README.md` for model format details.

## Features

- 4x4 2048 board
- Randomized initial board setup
- Left / right / up / down movement
- Adds a new `2` or `4` after valid moves
- Win detection (reaching 2048)
- Loss detection (no legal moves remaining)
- Keyboard controls
- Offline AI move suggestion

## AI Move Suggestion

The project includes two local suggestion strategies:

- **Basic heuristic suggestion** (old fashioned)
- **Offline AI model suggestion (TensorFlow.js)**

### Brief explanation of the AI heuristic

The basic heuristic evaluates each possible move and scores the resulting board using a weighted combination of:

- Number of empty cells (more space is better)
- Number of merge opportunities (adjacent equal tiles)
- Value of the highest tile
- Bonus if the highest tile is kept in a corner
- Large penalty if the board becomes immobile

The move with the highest score is suggested.

### Offline AI model

In AI mode, the app loads a local TensorFlow.js model from `public/models/2048/model.json` and predicts directional scores for `left`, `up`, `right`, and `down`. The app then picks the highest-scoring **legal** move.

No external AI API calls or credentials are required.