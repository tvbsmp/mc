const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_RADIUS = 10;
const PADDLE_MARGIN = 18;
const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const PLAYER_COLOR = '#29e';
const AI_COLOR = '#e22';
const BALL_COLOR = '#fff';

// Game objects
let playerY = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let aiY = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
let ballX = CANVAS_WIDTH / 2;
let ballY = CANVAS_HEIGHT / 2;
let ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 3 * (Math.random() * 2 - 1);
let aiSpeed = 4;

function resetBall() {
    ballX = CANVAS_WIDTH / 2;
    ballY = CANVAS_HEIGHT / 2;
    ballSpeedX = 6 * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = 3 * (Math.random() * 2 - 1);
}

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 3;
    for (let y = 10; y < CANVAS_HEIGHT; y += 40) {
        ctx.beginPath();
        ctx.moveTo(CANVAS_WIDTH / 2, y);
        ctx.lineTo(CANVAS_WIDTH / 2, y + 20);
        ctx.stroke();
    }
}

function draw() {
    // Clear
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Net
    drawNet();

    // Player paddle
    drawRect(PADDLE_MARGIN, playerY, PADDLE_WIDTH, PADDLE_HEIGHT, PLAYER_COLOR);

    // AI paddle
    drawRect(CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT, AI_COLOR);

    // Ball
    drawCircle(ballX, ballY, BALL_RADIUS, BALL_COLOR);
}

function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Wall collision (top and bottom)
    if (ballY - BALL_RADIUS < 0) {
        ballY = BALL_RADIUS;
        ballSpeedY = -ballSpeedY;
    }
    if (ballY + BALL_RADIUS > CANVAS_HEIGHT) {
        ballY = CANVAS_HEIGHT - BALL_RADIUS;
        ballSpeedY = -ballSpeedY;
    }

    // Left paddle collision (player)
    if (
        ballX - BALL_RADIUS < PADDLE_MARGIN + PADDLE_WIDTH &&
        ballY > playerY &&
        ballY < playerY + PADDLE_HEIGHT
    ) {
        ballX = PADDLE_MARGIN + PADDLE_WIDTH + BALL_RADIUS; // Prevent sticking
        ballSpeedX = -ballSpeedX;
        // Add some "spin" based on where the ball hits the paddle
        let deltaY = ballY - (playerY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.2;
    }

    // Right paddle collision (AI)
    if (
        ballX + BALL_RADIUS > CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH &&
        ballY > aiY &&
        ballY < aiY + PADDLE_HEIGHT
    ) {
        ballX = CANVAS_WIDTH - PADDLE_MARGIN - PADDLE_WIDTH - BALL_RADIUS; // Prevent sticking
        ballSpeedX = -ballSpeedX;
        let deltaY = ballY - (aiY + PADDLE_HEIGHT / 2);
        ballSpeedY = deltaY * 0.2;
    }

    // Left or right wall: reset ball
    if (ballX < 0 || ballX > CANVAS_WIDTH) {
        resetBall();
    }

    // AI movement (very basic)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY - 12) aiY += aiSpeed;
    else if (aiCenter > ballY + 12) aiY -= aiSpeed;

    // Keep AI paddle within bounds
    if (aiY < 0) aiY = 0;
    if (aiY + PADDLE_HEIGHT > CANVAS_HEIGHT) aiY = CANVAS_HEIGHT - PADDLE_HEIGHT;
}

// Mouse movement controls player paddle
canvas.addEventListener('mousemove', function (evt) {
    let rect = canvas.getBoundingClientRect();
    let scale = CANVAS_HEIGHT / rect.height;
    let mouseY = (evt.clientY - rect.top) * scale;
    playerY = mouseY - PADDLE_HEIGHT / 2;
    // Keep player paddle within bounds
    if (playerY < 0) playerY = 0;
    if (playerY + PADDLE_HEIGHT > CANVAS_HEIGHT) playerY = CANVAS_HEIGHT - PADDLE_HEIGHT;
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();