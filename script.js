/* =========================================
   CATCH THE STARS - FULL AWS VERSION
   ========================================= */

/* CANVAS */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* =========================================
   AWS API URL
   ========================================= */

const API_BASE_URL =
  "https://mgm7zmhcl9.execute-api.eu-north-1.amazonaws.com/prod";

/* =========================================
   GAME VARIABLES
   ========================================= */

let username = "";
let score = 0;
let level = 1;
let timer = 30;
let gameRunning = false;

const levels = [
  { target: 15, time: 30, speed: 3 },
  { target: 25, time: 35, speed: 4 },
  { target: 40, time: 40, speed: 5 }
];

let targetStars = levels[0].target;
let starsCaught = 0;

/* =========================================
   BASKET
   ========================================= */

const basket = {

  x: canvas.width / 2 - 70,

  y: canvas.height - 120,

  width: 140,

  height: 80,

  speed: 12
};

/* =========================================
   ARRAYS
   ========================================= */

const stars = [];
const particles = [];
const keys = {};

/* =========================================
   STAR CLASS
   ========================================= */

class Star {

  constructor() {

    this.x =
      Math.random() *
      (canvas.width - 100) + 50;

    this.y = 0;

    this.radius = 24;

    this.speed =
      levels[level - 1].speed;

    this.color = [

      "#FFD700",
      "#00E5FF",
      "#FF5252"

    ][Math.floor(Math.random() * 3)];
  }

  update() {
    this.y += this.speed;
  }

  draw() {

    drawStar(
      this.x,
      this.y,
      5,
      24,
      12,
      this.color
    );
  }
}

/* =========================================
   DRAW STAR
   ========================================= */

function drawStar(
  x,
  y,
  spikes,
  outerRadius,
  innerRadius,
  color
) {

  let rot = Math.PI / 2 * 3;

  let step = Math.PI / spikes;

  ctx.beginPath();

  ctx.moveTo(x, y - outerRadius);

  for (let i = 0; i < spikes; i++) {

    ctx.lineTo(
      x + Math.cos(rot) * outerRadius,
      y + Math.sin(rot) * outerRadius
    );

    rot += step;

    ctx.lineTo(
      x + Math.cos(rot) * innerRadius,
      y + Math.sin(rot) * innerRadius
    );

    rot += step;
  }

  ctx.lineTo(x, y - outerRadius);

  ctx.closePath();

  ctx.fillStyle = color;

  ctx.shadowColor = color;

  ctx.shadowBlur = 15;

  ctx.fill();

  ctx.shadowBlur = 0;
}

/* =========================================
   DRAW BASKET
   ========================================= */

function drawBasket() {

  /* Basket Body */

  ctx.fillStyle = "#8B4513";

  ctx.beginPath();

  ctx.ellipse(
    basket.x + basket.width / 2,
    basket.y + basket.height / 2,
    basket.width / 2,
    basket.height / 2,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();

  /* Basket Lines */

  ctx.strokeStyle = "#5D2E0E";

  for (let i = 0; i < basket.width; i += 15) {

    ctx.beginPath();

    ctx.moveTo(
      basket.x + i,
      basket.y + 10
    );

    ctx.lineTo(
      basket.x + i,
      basket.y + basket.height - 10
    );

    ctx.stroke();
  }

  /* Basket Handle */

  ctx.beginPath();

  ctx.arc(
    basket.x + basket.width / 2,
    basket.y + 10,
    basket.width / 3,
    Math.PI,
    0
  );

  ctx.stroke();
}

/* =========================================
   SPAWN STAR
   ========================================= */

function spawnStar() {

  stars.push(
    new Star()
  );
}

/* =========================================
   UPDATE STARS
   ========================================= */

function updateStars() {

  for (
    let i = stars.length - 1;
    i >= 0;
    i--
  ) {

    const star = stars[i];

    star.update();

    /* COLLISION */

    if (

      star.x > basket.x &&

      star.x <
      basket.x + basket.width &&

      star.y + star.radius >
      basket.y &&

      star.y <
      basket.y + basket.height

    ) {

      starsCaught++;

      score += 10;

      document.getElementById(
        "score"
      ).textContent = score;

      createParticles(
        star.x,
        star.y,
        star.color
      );

      stars.splice(i, 1);

      if (
        starsCaught >= targetStars
      ) {

        completeLevel();
      }

      continue;
    }

    if (
      star.y >
      canvas.height + 50
    ) {

      stars.splice(i, 1);
    }
  }
}

/* =========================================
   PARTICLES
   ========================================= */

function createParticles(
  x,
  y,
  color
) {

  for (let i = 0; i < 15; i++) {

    particles.push({

      x,
      y,

      dx:
        Math.random() * 6 - 3,

      dy:
        Math.random() * 6 - 3,

      life: 30,

      color
    });
  }
}

function updateParticles() {

  for (
    let i = particles.length - 1;
    i >= 0;
    i--
  ) {

    const p = particles[i];

    p.x += p.dx;

    p.y += p.dy;

    p.life--;

    ctx.fillStyle = p.color;

    ctx.fillRect(
      p.x,
      p.y,
      4,
      4
    );

    if (p.life <= 0) {

      particles.splice(i, 1);
    }
  }
}

/* =========================================
   MOVE BASKET
   ========================================= */

function moveBasket() {

  if (
    (keys["ArrowLeft"] || keys["a"]) &&
    basket.x > 0
  ) {

    basket.x -= basket.speed;
  }

  if (
    (keys["ArrowRight"] || keys["d"]) &&
    basket.x <
    canvas.width - basket.width
  ) {

    basket.x += basket.speed;
  }
}

/* =========================================
   GAME LOOP
   ========================================= */

function gameLoop() {

  if (!gameRunning) return;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  /* BACKGROUND */

  ctx.fillStyle = "#081b4b";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  /* STARS BACKGROUND */

  for (let i = 0; i < 100; i++) {

    ctx.fillStyle =
      "rgba(255,255,255,0.2)";

    ctx.fillRect(

      Math.random() * canvas.width,

      Math.random() * canvas.height,

      2,

      2
    );
  }

  moveBasket();

  drawBasket();

  stars.forEach(star => {
    star.draw();
  });

  updateStars();

  updateParticles();

  requestAnimationFrame(gameLoop);
}

/* =========================================
   STAR GENERATOR
   ========================================= */

setInterval(() => {

  if (gameRunning) {

    spawnStar();
  }

}, 600);

/* =========================================
   TIMER
   ========================================= */

setInterval(() => {

  if (gameRunning) {

    timer--;

    document.getElementById(
      "timer"
    ).textContent = timer;

    if (timer <= 0) {

      endGame();
    }
  }

}, 1000);

/* =========================================
   START LEVEL
   ========================================= */

function startLevel() {

  const current =
    levels[level - 1];

  timer = current.time;

  targetStars =
    current.target;

  starsCaught = 0;

  document.getElementById(
    "target"
  ).textContent = targetStars;

  document.getElementById(
    "level"
  ).textContent = level;

  document.getElementById(
    "levelText"
  ).textContent =
    `LEVEL ${level}`;

  document.getElementById(
    "missionText"
  ).textContent =
    `Catch ${targetStars} stars in ${timer} seconds`;

  document.getElementById(
    "timer"
  ).textContent = timer;

  gameRunning = true;

  requestAnimationFrame(
    gameLoop
  );
}

/* =========================================
   COMPLETE LEVEL
   ========================================= */

function completeLevel() {

  gameRunning = false;

  document
    .getElementById(
      "levelComplete"
    )
    .classList.remove(
      "hidden"
    );
}

/* =========================================
   NEXT LEVEL
   ========================================= */

function nextLevel() {

  document
    .getElementById(
      "levelComplete"
    )
    .classList.add(
      "hidden"
    );

  level++;

  if (
    level > levels.length
  ) {

    endGame();

    return;
  }

  startLevel();
}

/* =========================================
   SAVE SCORE TO AWS
   ========================================= */

async function saveScoreToAWS() {

  try {

    const response =
      await fetch(

        `${API_BASE_URL}/save-score`,

        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            username,
            score,
            level
          })
        }
      );

    const data =
      await response.json();

    console.log(data);

  } catch (error) {

    console.log(error);
  }
}

/* =========================================
   FETCH LEADERBOARD
   ========================================= */

async function fetchLeaderboard() {

  try {

    const response =
      await fetch(

        `${API_BASE_URL}/leaderboard`
      );

    const data =
      await response.json();

    const leaderboard =
      document.getElementById(
        "leaderboard"
      );

    leaderboard.innerHTML =
      "<h3>🏆 Global Leaderboard</h3>";

    data.forEach(
      (player, index) => {

        leaderboard.innerHTML += `

          <p>
            ${index + 1}.
            ${player.username}
            - ${player.score}
          </p>
        `;
      }
    );

  } catch (error) {

    console.log(error);
  }
}

/* =========================================
   END GAME
   ========================================= */

async function endGame() {

  gameRunning = false;

  await saveScoreToAWS();

  await fetchLeaderboard();

  document
    .getElementById(
      "gameOver"
    )
    .classList.remove(
      "hidden"
    );

  document
    .getElementById(
      "finalScore"
    )
    .textContent = score;
}

/* =========================================
   RESTART
   ========================================= */

function restartGame() {

  location.reload();
}

/* =========================================
   KEYBOARD CONTROLS
   ========================================= */

window.addEventListener(
  "keydown",
  e => {

    keys[e.key] = true;
  }
);

window.addEventListener(
  "keyup",
  e => {

    keys[e.key] = false;
  }
);

/* =========================================
   START GAME
   ========================================= */

document
  .getElementById(
    "startBtn"
  )
  .addEventListener(
    "click",
    () => {

      username =
        document.getElementById(
          "username"
        ).value;

      if (!username) {

        alert(
          "Enter username"
        );

        return;
      }

      document
        .getElementById(
          "startScreen"
        )
        .classList.add(
          "hidden"
        );

      document
        .getElementById(
          "gameUI"
        )
        .classList.remove(
          "hidden"
        );

      document
        .getElementById(
          "levelInfo"
        )
        .classList.remove(
          "hidden"
        );

      startLevel();
    }
  );

/* =========================================
   NEXT LEVEL BUTTON
   ========================================= */

document
  .getElementById(
    "nextLevelBtn"
  )
  .addEventListener(
    "click",
    nextLevel
  );