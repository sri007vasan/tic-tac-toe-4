# Tic Tac Toe

A clean, accessible Tic Tac Toe game built with vanilla HTML, CSS, and JavaScript. No build step required — runs directly in the browser.

## Features

- Classic 3×3 Tic Tac Toe gameplay
- Player turn indicator (X goes first)
- Win detection with highlighted winning line
- Draw detection
- Score tracking (X wins, O wins, draws) persisted in localStorage
- New Game button to reset the board while keeping scores
- Fully keyboard accessible (Tab to navigate, Enter/Space to play)
- Responsive design down to 360px
- Light and dark mode support (follows system preference)
- No console errors

## Run locally

```bash
npx http-server .
```

Then open http://localhost:8080 in your browser.

## Run tests

```bash
npm install
npx playwright install chromium
npm test
```

Tests are written with Playwright and cover:
- Page loads without console errors
- Basic gameplay (placing marks, alternating turns)
- Win detection for rows, columns, and diagonals
- Draw detection
- Score persistence across page reloads
- Keyboard accessibility
- Reset functionality
