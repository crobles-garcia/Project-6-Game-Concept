// --- Declare variables ONCE at the top ---
let score = 0;
let timeLeft = 30;
let dropInterval, timerInterval;
let isPlaying = false;
let purifierActive = false;
let purifierTimeout = null;

const player = document.getElementById('player');
const gameScreen = document.getElementById('gameScreen');
const statusBar = document.getElementById('statusBar');
const messageBox = document.getElementById('messageBox');
const catchSound = document.getElementById('catchSound');
const bgMusic = document.getElementById('bgMusic');
const muteBtn = document.getElementById('muteBtn');
let isMuted = false;

let currentTheme = 'rural';
let currentDropInterval = 800;

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

  setThemeAndDifficulty();
  timerInterval = setInterval(updateTimer, 1000);

  // Start music if not muted
  if (!isMuted) {
    bgMusic.currentTime = 0;
    bgMusic.volume = 0.5;
    bgMusic.muted = false;
    // Play and handle promise
    bgMusic.play().catch((e) => {
      // Optionally show a message if playback fails
      console.log("Audio playback was prevented by the browser.", e);
    });
  }
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
  let dropType = 'normal';

  // Decide drop type
  const rand = Math.random();
  if (rand < 0.08) {
    // 8% chance for a bonus drop
    const bonusRand = Math.random();
    if (bonusRand < 0.33) {
      dropType = 'golden';
      drop.className = 'water-drop bonus-drop golden-drop';
    } else if (bonusRand < 0.66) {
      dropType = 'clock';
      drop.className = 'water-drop bonus-drop clock-drop';
    } else {
      dropType = 'purifier';
      drop.className = 'water-drop bonus-drop purifier-drop';
    }
  } else if (rand < 0.28) {
    dropType = 'bad';
    drop.className = 'water-drop bad-drop';
  } else {
    drop.className = 'water-drop';
  }

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
        // Collision detected
        player.classList.remove('wiggle'); // reset if already animating
        void player.offsetWidth; // force reflow for restart
        player.classList.add('wiggle');

        if (dropType === 'bad') {
          score -= 10;
          messageBox.textContent = "Oh no! Bad water drop! -10";
        } else if (dropType === 'golden') {
          score += purifierActive ? 100 : 50;
          messageBox.textContent = "Golden Drop! +" + (purifierActive ? "100" : "50");
        } else if (dropType === 'clock') {
          timeLeft += 5;
          messageBox.textContent = "Clock Drop! +5s";
        } else if (dropType === 'purifier') {
          activatePurifier();
          messageBox.textContent = "Purifier! Double points for 5s!";
        } else {
          score += purifierActive ? 20 : 10;
          messageBox.textContent = "Nice catch! +" + (purifierActive ? "20" : "10");
          catchSound.currentTime = 0;
          catchSound.play();
        }
        updateStatus();
        drop.remove();
        clearInterval(fallInterval);

        // Remove wiggle class after animation
        setTimeout(() => player.classList.remove('wiggle'), 400);
      }
    }
    if (top > gameScreen.offsetHeight) {
      drop.remove();
      clearInterval(fallInterval);
    }
  }, 20);
}

function activatePurifier() {
  purifierActive = true;
  if (purifierTimeout) clearTimeout(purifierTimeout);
  purifierTimeout = setTimeout(() => {
    purifierActive = false;
    messageBox.textContent = "Purifier ended!";
  }, 5000);
}

function setThemeAndDifficulty() {
  if (timeLeft > 20) {
    document.body.classList.add('rural');
    document.body.classList.remove('desert', 'storm');
    currentTheme = 'rural';
    currentDropInterval = 800; // easy
  } else if (timeLeft > 10) {
    document.body.classList.add('desert');
    document.body.classList.remove('rural', 'storm');
    currentTheme = 'desert';
    currentDropInterval = 600; // medium
  } else {
    document.body.classList.add('storm');
    document.body.classList.remove('rural', 'desert');
    currentTheme = 'storm';
    currentDropInterval = 400; // hard/fast
  }
  // Restart drop interval with new speed
  clearInterval(dropInterval);
  dropInterval = setInterval(spawnDrop, currentDropInterval);
}

// Update timer and end game if time is up
function updateTimer() {
  timeLeft--;
  setThemeAndDifficulty();
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
  bgMusic.pause();
  bgMusic.currentTime = 0;

  // Confetti celebration!
  if (window.confetti) {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  }
}

// Remove all drops
function clearDrops() {
  document.querySelectorAll('.water-drop').forEach(drop => drop.remove());
}

// Expose startGame globally so the button works
window.startGame = startGame;

// Touch controls and mute logic
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
if (leftBtn && rightBtn) {
  leftBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const event = new KeyboardEvent('keydown', {key: 'ArrowLeft'});
    movePlayer(event);
  });
  rightBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    const event = new KeyboardEvent('keydown', {key: 'ArrowRight'});
    movePlayer(event);
  });
}

// Mute/unmute logic
if (muteBtn && bgMusic) {
  muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    bgMusic.muted = isMuted;
    muteBtn.textContent = isMuted ? '🔇 Unmute' : '🔊 Mute';
    if (!isMuted && isPlaying) {
      bgMusic.play();
    }
  });
}

// --- Water facts logic ---
const facts = [
  "771 million people lack clean water.",
  "Dirty water kills more people than violence.",
  "Women spend 200 million hours daily collecting water."
];
let factIndex = 0;
const factBox = document.getElementById('factBox');
setInterval(() => {
  if (isPlaying && factBox) {
    factBox.textContent = "Did you know? " + facts[factIndex % facts.length];
    factIndex++;
  }
}, 5000);
