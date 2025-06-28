// Game variables
let score = 0;
let timeLeft = 30;
let dropInterval, timerInterval;
let isPlaying = false;

const player = document.getElementById('player');
const gameScreen = document.getElementById('gameScreen');
const statusBar = document.getElementById('statusBar');
const messageBox = document.getElementById('messageBox');
const catchSound = document.getElementById('catchSound');

// Start the game
function startGame() {
  if (isPlaying) return;
  isPlaying = true;
  score = 0;
  timeLeft = 30;
  updateStatus();
  messageBox.textContent = "Catch the water drops!";
  gameScreen.style.display = "block";
  player.style.left = "150px";
  clearDrops();

  document.addEventListener('keydown', movePlayer);

  dropInterval = setInterval(spawnDrop, 800);
  timerInterval = setInterval(updateTimer, 1000);
}

// Move player left/right
function movePlayer(e) {
  const gameWidth = gameScreen.offsetWidth;
  const playerWidth = player.offsetWidth;
  const left = parseInt(player.style.left) || 0;
  if (e.key === "ArrowLeft" && left > 0) {
    player.style.left = Math.max(0, left - 0.06 * gameWidth) + "px";
  }
  if (e.key === "ArrowRight" && left < gameWidth - playerWidth) {
    player.style.left = Math.min(gameWidth - playerWidth, left + 0.06 * gameWidth) + "px";
  }
}

// Spawn a water drop
function spawnDrop() {
  const gameWidth = gameScreen.offsetWidth;
  const drop = document.createElement('div');
  const isBad = Math.random() < 0.2;
  drop.className = isBad ? 'water-drop bad-drop' : 'water-drop';
  const dropWidth = 0.06 * gameWidth;
  drop.style.left = Math.floor(Math.random() * (gameWidth - dropWidth)) + "px";
  drop.style.top = "0px";
  gameScreen.appendChild(drop);

  let fallInterval = setInterval(() => {
    let top = parseInt(drop.style.top);
    drop.style.top = (top + 0.016 * gameScreen.offsetHeight) + "px";

    if (top > gameScreen.offsetHeight - player.offsetHeight - drop.offsetHeight) {
      const dropLeft = parseInt(drop.style.left);
      const playerLeft = parseInt(player.style.left);
      if (
        dropLeft + drop.offsetWidth > playerLeft &&
        dropLeft < playerLeft + player.offsetWidth
      ) {
        if (isBad) {
          score -= 10;
          messageBox.textContent = "Oh no! Bad water drop! -10";
        } else {
          score += 10;
          messageBox.textContent = "Nice catch! +10";
          catchSound.currentTime = 0;
          catchSound.play();
        }
        updateStatus();
        drop.remove();
        clearInterval(fallInterval);
      }
    }
    if (top > gameScreen.offsetHeight) {
      drop.remove();
      clearInterval(fallInterval);
    }
  }, 20);
}

// Update timer and end game if time is up
function updateTimer() {
  timeLeft--;
  updateStatus();
  if (timeLeft <= 0) {
    endGame();
  }
}

// Update scoreboard
function updateStatus() {
  statusBar.textContent = `Time: ${timeLeft} | Score: ${score}`;
}

// End the game
function endGame() {
  isPlaying = false;
  clearInterval(dropInterval);
  clearInterval(timerInterval);
  document.removeEventListener('keydown', movePlayer);
  messageBox.textContent = `Game Over! You scored ${score} points.`;
}

// Remove all drops
function clearDrops() {
  document.querySelectorAll('.water-drop').forEach(drop => drop.remove());
}

// Expose startGame globally so the button works
window.startGame = startGame;

window.onload = function() {
  // Game variables
  let score = 0;
  let timeLeft = 30;
  let dropInterval, timerInterval;
  let isPlaying = false;

  const player = document.getElementById('player');
  const gameScreen = document.getElementById('gameScreen');
  const statusBar = document.getElementById('statusBar');
  const messageBox = document.getElementById('messageBox');
  const catchSound = document.getElementById('catchSound');

  function startGame() {
    if (isPlaying) return;
    isPlaying = true;
    score = 0;
    timeLeft = 30;
    updateStatus();
    messageBox.textContent = "Catch the water drops!";
    gameScreen.style.display = "block";
    player.style.left = "150px";
    clearDrops();

    document.addEventListener('keydown', movePlayer);

    dropInterval = setInterval(spawnDrop, 800);
    timerInterval = setInterval(updateTimer, 1000);
  }

  function movePlayer(e) {
    const gameWidth = gameScreen.offsetWidth;
    const playerWidth = player.offsetWidth;
    const left = parseInt(player.style.left) || 0;
    if (e.key === "ArrowLeft" && left > 0) {
      player.style.left = Math.max(0, left - 0.06 * gameWidth) + "px";
    }
    if (e.key === "ArrowRight" && left < gameWidth - playerWidth) {
      player.style.left = Math.min(gameWidth - playerWidth, left + 0.06 * gameWidth) + "px";
    }
  }

  function spawnDrop() {
    const gameWidth = gameScreen.offsetWidth;
    const drop = document.createElement('div');
    const isBad = Math.random() < 0.2;
    drop.className = isBad ? 'water-drop bad-drop' : 'water-drop';
    const dropWidth = 0.06 * gameWidth;
    drop.style.left = Math.floor(Math.random() * (gameWidth - dropWidth)) + "px";
    drop.style.top = "0px";
    gameScreen.appendChild(drop);

    let fallInterval = setInterval(() => {
      let top = parseInt(drop.style.top);
      drop.style.top = (top + 0.016 * gameScreen.offsetHeight) + "px";

      if (top > gameScreen.offsetHeight - player.offsetHeight - drop.offsetHeight) {
        const dropLeft = parseInt(drop.style.left);
        const playerLeft = parseInt(player.style.left);
        if (
          dropLeft + drop.offsetWidth > playerLeft &&
          dropLeft < playerLeft + player.offsetWidth
        ) {
          if (isBad) {
            score -= 10;
            messageBox.textContent = "Oh no! Bad water drop! -10";
          } else {
            score += 10;
            messageBox.textContent = "Nice catch! +10";
            catchSound.currentTime = 0;
            catchSound.play();
          }
          updateStatus();
          drop.remove();
          clearInterval(fallInterval);
        }
      }
      if (top > gameScreen.offsetHeight) {
        drop.remove();
        clearInterval(fallInterval);
      }
    }, 20);
  }

  function updateTimer() {
    timeLeft--;
    updateStatus();
    if (timeLeft <= 0) {
      endGame();
    }
  }

  function updateStatus() {
    statusBar.textContent = `Time: ${timeLeft} | Score: ${score}`;
  }

  function endGame() {
    isPlaying = false;
    clearInterval(dropInterval);
    clearInterval(timerInterval);
    document.removeEventListener('keydown', movePlayer);
    messageBox.textContent = `Game Over! You scored ${score} points.`;
  }

  function clearDrops() {
    document.querySelectorAll('.water-drop').forEach(drop => drop.remove());
  }

  // Expose startGame globally so the button works
  window.startGame = startGame;

  // Touch controls
  const leftBtn = document.getElementById('leftBtn');
  const rightBtn = document.getElementById('rightBtn');

  if (leftBtn && rightBtn) {
    leftBtn.addEventListener('touchstart', () => movePlayer({ key: "ArrowLeft" }));
    rightBtn.addEventListener('touchstart', () => movePlayer({ key: "ArrowRight" }));
  }
};