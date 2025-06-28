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
  const left = parseInt(player.style.left) || 0;
  if (e.key === "ArrowLeft" && left > 0) {
    player.style.left = (left - 20) + "px";
  }
  if (e.key === "ArrowRight" && left < 310) {
    player.style.left = (left + 20) + "px";
  }
}

// Spawn a water drop
function spawnDrop() {
  const drop = document.createElement('div');
  // Randomly decide if this is a good or bad drop
  const isBad = Math.random() < 0.2; // 20% chance for a bad drop
  drop.className = isBad ? 'water-drop bad-drop' : 'water-drop';
  drop.style.left = Math.floor(Math.random() * 330) + "px";
  drop.style.top = "0px";
  gameScreen.appendChild(drop);

  let fallInterval = setInterval(() => {
    let top = parseInt(drop.style.top);
    drop.style.top = (top + 5) + "px";

    // Collision with player
    if (top > 240) {
      const dropLeft = parseInt(drop.style.left);
      const playerLeft = parseInt(player.style.left);
      if (dropLeft > playerLeft - 20 && dropLeft < playerLeft + 40) {
        if (isBad) {
          score -= 10;
          messageBox.textContent = "Oh no! Bad water drop!";
        } else {
          score++;
          messageBox.textContent = "Nice catch!";
          catchSound.currentTime = 0;
          catchSound.play();
        }
        updateStatus();
        drop.remove();
        clearInterval(fallInterval);
      }
    }
    // Missed drop
    if (top > 270) {
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
    const left = parseInt(player.style.left) || 0;
    if (e.key === "ArrowLeft" && left > 0) {
      player.style.left = (left - 20) + "px";
    }
    if (e.key === "ArrowRight" && left < 310) {
      player.style.left = (left + 20) + "px";
    }
  }

  function spawnDrop() {
    const drop = document.createElement('div');
    // Randomly decide if this is a good or bad drop
    const isBad = Math.random() < 0.2; // 20% chance for a bad drop
    drop.className = isBad ? 'water-drop bad-drop' : 'water-drop';
    drop.style.left = Math.floor(Math.random() * 330) + "px";
    drop.style.top = "0px";
    gameScreen.appendChild(drop);

    let fallInterval = setInterval(() => {
      let top = parseInt(drop.style.top);
      drop.style.top = (top + 5) + "px";

      // Collision with player
      if (top > 240) {
        const dropLeft = parseInt(drop.style.left);
        const playerLeft = parseInt(player.style.left);
        if (dropLeft > playerLeft - 20 && dropLeft < playerLeft + 40) {
          if (isBad) {
            score -= 10;
            messageBox.textContent = "Oh no! Bad water drop!";
          } else {
            score++;
            messageBox.textContent = "Nice catch!";
            catchSound.currentTime = 0;
            catchSound.play();
          }
          updateStatus();
          drop.remove();
          clearInterval(fallInterval);
        }
      }
      // Missed drop
      if (top > 270) {
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
};