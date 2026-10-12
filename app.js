(() => {
  const WIN_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];

  const STORAGE_KEY = 'tic-tac-toe-scores';

  let board = Array(9).fill(null);
  let currentPlayer = 'X';
  let gameActive = true;
  let scores = { X: 0, O: 0, draw: 0 };

  const cells = document.querySelectorAll('.cell');
  const statusEl = document.getElementById('status');
  const scoreXEl = document.getElementById('score-x');
  const scoreOEl = document.getElementById('score-o');
  const scoreDrawEl = document.getElementById('score-draw');
  const resetBtn = document.getElementById('reset-btn');

  function loadScores() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        scores = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load scores from localStorage', e);
    }
    updateScoreDisplay();
  }

  function saveScores() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
    } catch (e) {
      console.warn('Failed to save scores to localStorage', e);
    }
  }

  function updateScoreDisplay() {
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    scoreDrawEl.textContent = scores.draw;
  }

  function checkWinner() {
    for (const combo of WIN_COMBINATIONS) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { winner: board[a], combo };
      }
    }
    if (board.every(cell => cell !== null)) {
      return { winner: 'draw', combo: null };
    }
    return null;
  }

  function highlightWinningCells(combo) {
    if (!combo) return;
    combo.forEach(index => {
      cells[index].classList.add('winning');
    });
  }

  function handleCellClick(index) {
    if (!gameActive || board[index] !== null) return;

    board[index] = currentPlayer;
    const cell = cells[index];
    cell.textContent = currentPlayer;
    cell.classList.add(currentPlayer.toLowerCase());
    cell.disabled = true;
    cell.setAttribute('aria-label', `${cell.getAttribute('aria-label')}, ${currentPlayer}`);

    const result = checkWinner();
    if (result) {
      gameActive = false;
      if (result.winner === 'draw') {
        statusEl.textContent = "It's a draw!";
        statusEl.classList.add('draw');
        statusEl.classList.remove('winner');
        scores.draw++;
      } else {
        statusEl.textContent = `Player ${result.winner} wins!`;
        statusEl.classList.add('winner');
        statusEl.classList.remove('draw');
        scores[result.winner]++;
        highlightWinningCells(result.combo);
      }
      saveScores();
      updateScoreDisplay();
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      statusEl.textContent = `Player ${currentPlayer}'s turn`;
      statusEl.classList.remove('winner', 'draw');
    }
  }

  function resetGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    statusEl.textContent = "Player X's turn";
    statusEl.classList.remove('winner', 'draw');
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('x', 'o', 'winning');
      cell.disabled = false;
      const baseLabel = cell.getAttribute('aria-label').split(',')[0];
      cell.setAttribute('aria-label', baseLabel);
    });
  }

  function init() {
    loadScores();
    cells.forEach((cell, index) => {
      cell.addEventListener('click', () => handleCellClick(index));
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCellClick(index);
        }
      });
    });
    resetBtn.addEventListener('click', resetGame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
