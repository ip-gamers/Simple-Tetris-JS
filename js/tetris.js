// Массив с пасхальным видео
let keySequence = '';
const combination = '4815162342'; // Комбинация, которую нужно ввести пользователю.
let videoOpened = false; // Переменная для проверки, было ли открыто окно с видео.

document.addEventListener('keydown', function (e) {
  keySequence += e.key;

  if (keySequence === combination && !videoOpened) {
    playVideo();
    keySequence = '';
    videoOpened = true; // Устанавливаем значение true, чтобы окно с видео больше не открывалось.
  } else if (!combination.startsWith(keySequence)) {
    keySequence = '';
  }
});

function playVideo() {
  // Настройки всплывающего окна с видео
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '9999';

  const videoElement = document.createElement('video');
  videoElement.src = 'https://ip-gamers.net/downloads/Ever/pages_media/2_4zshit.mp4'; // Прямая ссылка на видео
  videoElement.autoplay = true; // Автовоспроизведение
  videoElement.style.maxWidth = '60%';
  videoElement.style.maxHeight = '60%';

  // Добавляем видео во всплывающее окно
  overlay.appendChild(videoElement);

  // Добавляем всплывающее окно на страницу
  document.body.appendChild(overlay);

  // Удаляем всплывающее окно (и видео) после окончания видео
  videoElement.addEventListener('ended', function () {
    document.body.removeChild(overlay);
  });
}
// Окончание массива с пасхальным видео

let heldTetromino = null; // Дополнительная переменная для хранения удерживаемого тетромино

// Ссылка на элемент контейнера для отображения удерживаемого тетромино
const holdPieceCanvas = document.getElementById('holdPiece');
const holdPieceContext = holdPieceCanvas.getContext('2d');
const holdPieceGrid = 20;

// Функция для отображения удерживаемого тетромино
function drawHoldPiece() {
  holdPieceContext.clearRect(0, 0, holdPieceCanvas.width, holdPieceCanvas.height);

  if (heldTetromino) {
    const matrix = heldTetromino.matrix;
    const name = heldTetromino.name;

    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col]) {
          const x = col * holdPieceGrid;
          const y = row * holdPieceGrid;
          holdPieceContext.fillStyle = colors[name];
          holdPieceContext.fillRect(x, y, holdPieceGrid - 1, holdPieceGrid - 1);
        }
      }
    }
  }
}

// Функция для удержания текущего падающего тетромино
function holdTetromino() {
  if (!heldTetromino) {
    heldTetromino = tetromino;
    tetromino = getNextTetromino();
    drawNextPiece();
  } else {
    const tempTetromino = tetromino;
    tetromino = heldTetromino;
    heldTetromino = tempTetromino;
  }

  // Сброс позиции тетромино, снова на вверх по центру
  tetromino.row = tetromino.name === 'I' ? -1 : -2;
  tetromino.col = playfield[0].length / 2 - Math.ceil(tetromino.matrix[0].length / 2);

  drawNextPiece();
  drawHoldPiece(); // Обновление отображения удерживаемого тетромино
}

// Обработчик события для определения нажатия клавиши "C"
document.addEventListener('keydown', function (e) {
  if (e.keyCode === 67) {
    holdTetromino();
  }
});

const startBtn = document.querySelector('#start_btn');
const gameProcessBtn = document.querySelector('#game-process-btn');
const gamePlayIcon = document.querySelector('#game-play');
const gamePauseIcon = document.querySelector('#game-pause');
const soundBtn = document.querySelector('#sound-btn');
const soundOnIcon = document.querySelector('#sound-on');
const soundOffIcon = document.querySelector('#sound-off');
const ghostBtn = document.querySelector('#ghost-btn');
const holdBtn = document.querySelector('#hold-btn');
const bgMusic = document.getElementById('bgMusic');
const lineClearSound = document.getElementById('lineClearSound');
const gameOverSound = document.getElementById('gameOverSound');


// Определение нового элемента <canvas> для отображения основного игрового поля
const canvas = document.querySelector('canvas#game');
const context = canvas.getContext('2d');
const grid = 32;

// Определение нового элемента <canvas> для отображения следующего тетромино
const nextPieceCanvas = document.getElementById('nextPiece');
const nextPieceContext = nextPieceCanvas.getContext('2d');
const nextPieceGrid = 20;

const tetrominos = {
  'I': [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],
  'J': [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  'L': [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  'O': [
    [1, 1],
    [1, 1],
  ],
  'S': [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  'Z': [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  'T': [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ]
};
const colors = {
  'I': 'cyan',
  'O': 'yellow',
  'T': 'purple',
  'S': 'green',
  'Z': 'red',
  'J': 'blue',
  'L': 'orange'
};

const tetrominoSequence = [];
const playfield = [];

let isPaused = false;
let isSoundEnabled = true;
let score = 0;
let count = 0;
let level = 1;
let speed = 35;
let rAF = null;
let gameOver = false;
let tetromino;

function togglePause() {
  isPaused = !isPaused;

  gamePlayIcon.classList.toggle('hide');
  gamePauseIcon.classList.toggle('hide');

  if (isPaused) {
    cancelAnimationFrame(rAF); // Остановка анимации и игрового цикла при паузе
    bgMusic.pause();
  } else {
    rAF = requestAnimationFrame(loop); // Возобновление анимации и игрового цикла после паузы
    bgMusic.play();
  }
}

function toggleSound() {
  isSoundEnabled = !isSoundEnabled;

  soundOnIcon.classList.toggle('hide');
  soundOffIcon.classList.toggle('hide');

  if (isSoundEnabled) {
    bgMusic.play();
  } else {
    bgMusic.pause();
  }
}

// Функция для отображения следующего тетромино
function drawNextPiece() {
  nextPieceContext.clearRect(0, 0, nextPieceCanvas.width, nextPieceCanvas.height);

  if (tetrominoSequence.length > 0) {
    const nextPieceName = tetrominoSequence[tetrominoSequence.length - 1];
    const nextPieceMatrix = tetrominos[nextPieceName];

    for (let row = 0; row < nextPieceMatrix.length; row++) {
      for (let col = 0; col < nextPieceMatrix[row].length; col++) {
        if (nextPieceMatrix[row][col]) {
          const x = col * nextPieceGrid;
          const y = row * nextPieceGrid;
          nextPieceContext.fillStyle = colors[nextPieceName];
          nextPieceContext.fillRect(x, y, nextPieceGrid - 1, nextPieceGrid - 1);
        }
      }
    }
  }
}

// Генерация следующего тетромино
function getNextTetromino() {
  const name = tetrominoSequence.pop();

  if (tetrominoSequence.length === 0) {
    generateSequence();
  }

  const matrix = tetrominos[name];

  const col = playfield[0].length / 2 - Math.ceil(matrix[0].length / 2);

  const row = name === 'I' ? -1 : -2;

  // Отображение следующего тетромино
  drawNextPiece();

  return {
    name: name,
    matrix: matrix,
    row: row,
    col: col
  };
}

// Счет Игры
function updateScore(clearedLines) {
  const lineScores = [0, 1];
  score += lineScores[clearedLines];
  level = Math.floor(score / 5) + 1;
  updateSpeed(level);
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `Счет: ${score}`;

  // Сохранение счета игрока в localStorage (Я не знаю зачем это нужно в моем тетрисе)
  localStorage.setItem('playerScore', score.toString());
}

// Окончание Счета Игры
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rotate(matrix) {
  const N = matrix.length - 1;
  const result = matrix.map((row, i) =>
    row.map((val, j) => matrix[N - j][i])
  );

  return result;
}

function isValidMove(matrix, cellRow, cellCol) {
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      if (
        matrix[row][col] && (
          cellCol + col < 0 ||
          cellCol + col >= playfield[0].length ||
          cellRow + row >= playfield.length ||
          playfield[cellRow + row][cellCol + col]
        )
      ) {
        return false;
      }
    }
  }
  return true;
}

function generateSequence() {
  const sequence = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

  while (sequence.length) {
    const rand = getRandomInt(0, sequence.length - 1);
    const name = sequence.splice(rand, 1)[0];
    tetrominoSequence.push(name);
  }
}

function placeTetromino() {
  for (let row = 0; row < tetromino.matrix.length; row++) {
    for (let col = 0; col < tetromino.matrix[row].length; col++) {
      if (tetromino.matrix[row][col]) {
        if (tetromino.row + row < 0) {
          return showGameOver();
        }
        playfield[tetromino.row + row][tetromino.col + col] = tetromino.name;
      }
    }
    lineClearSound.play(); // Воспроизводим звук уничтожения линии
  }

  // Обновление следующего тетромино здесь
  tetromino = getNextTetromino();

  for (let row = playfield.length - 1; row >= 0;) {
    if (playfield[row].every(cell => !!cell)) {
      for (let r = row; r >= 0; r--) {
        for (let c = 0; c < playfield[r].length; c++) {
          playfield[r][c] = playfield[r - 1][c];
        }
      }
      updateScore(1);
    }
    else {
      row--;
    }
  }
}

function showGameOver() {
  cancelAnimationFrame(rAF);
  bgMusic.pause();
  gameOverSound.play();
  gameOver = true;
  startBtn.removeAttribute('disabled');
  context.fillStyle = 'black';
  context.globalAlpha = 0.75;
  context.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
  context.globalAlpha = 1;
  context.fillStyle = 'white';
  context.font = '36px monospace';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('108??', canvas.width / 2, canvas.height / 2);
}

function updateScore(clearedLines) {
  const lineScores = [0, 1];
  score += lineScores[clearedLines];
  level = Math.floor(score / 5) + 1;
  updateSpeed(level);
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `Счет: ${score}`;

}

function drawScore() {
  const rowsElement = document.getElementById('rows');
  rowsElement.textContent = `Уничтожено линий: ${score}`;

  const levelElement = document.getElementById('level');
  levelElement.textContent = `Скорость: ${level}`;
}

function drawGrid() {
  context.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  context.lineWidth = 0.5;

  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      context.strokeRect(col * grid, row * grid, grid, grid);
    }
  }
}

function generatePlayfield() {
  for (let row = -2; row < 20; row++) {
    playfield[row] = [];
    for (let col = 0; col < 10; col++) {
      playfield[row][col] = 0;
    }
  }
}

function drawGhost() {
  let row = tetromino.row;
  while (isValidMove(tetromino.matrix, row + 1, tetromino.col)) {
    row++;
  }

  context.save();
  context.globalAlpha = 0.4; // Прозрачность контура тетромино
  context.fillStyle = 'rgba(0, 0, 0, 0.4)'; // Цвет контура тетромино
  for (let r = 0; r < tetromino.matrix.length; r++) {
    for (let c = 0; c < tetromino.matrix[r].length; c++) {
      if (tetromino.matrix[r][c]) {
        context.fillRect(
          (tetromino.col + c) * grid,
          (row + r) * grid,
          grid - 1,
          grid - 1
        );
      }
    }
  }
  context.restore();
}

let showGhost = true;

function toggleGhost() {
  ghostBtn.classList.toggle('btn--active');
  showGhost = !showGhost; // Переключение значения переменной showGhost
}

document.addEventListener('keydown', function(event) {
  if (event.code === 'KeyG') { // Используйте event.code вместо event.key
    toggleGhost();
  }
});

function loop() {
  if (isPaused) {
    return; // Остановка выполнения функции при паузе
  }

  rAF = requestAnimationFrame(loop);
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      if (playfield[row][col]) {
        const name = playfield[row][col];
        context.fillStyle = colors[name];

        context.fillRect(col * grid, row * grid, grid - 1, grid - 1);
      }
    }
  }

  if (tetromino) {

    if (++count > speed) {
      tetromino.row++;
      count = 0;

      if (!isValidMove(tetromino.matrix, tetromino.row, tetromino.col)) {
        tetromino.row--;
        placeTetromino();
      }
    }

    context.fillStyle = colors[tetromino.name];

    for (let row = 0; row < tetromino.matrix.length; row++) {
      for (let col = 0; col < tetromino.matrix[row].length; col++) {
        if (tetromino.matrix[row][col]) {

          context.fillRect((tetromino.col + col) * grid, (tetromino.row + row) * grid, grid - 1, grid - 1);
        }
      }
    }
    if (showGhost) {
      drawGhost();
    }
  }
  drawScore();
  drawNextPiece();
}

function updateSpeed(level) {
  speed = Math.max(10, 35 - (level * 5));
}

function moveTetromino(e) {
  const activeElement = document.activeElement;

  // Проверяем, является ли активный элемент полем ввода
  const isInputActive = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA';

  // Проверяем, является ли активный элемент активным элементом формы
  const isFormElementActive = activeElement.hasAttribute('contenteditable') || isInputActive;

  // Если активным элементом является поле ввода или активный элемент формы, не предотвращаем стандартное поведение браузера
  if (isFormElementActive) {
    return;
  }

  if (gameOver) return;

  e.preventDefault(); // Отменяем стандартное поведение браузера

  if (e.which === 37 || e.which === 39) {
    const col = e.which === 37
      ? tetromino.col - 1
      : tetromino.col + 1;

    if (isValidMove(tetromino.matrix, tetromino.row, col)) {
      tetromino.col = col;
    }
  }
  if (e.which === 32) {
    let row = tetromino.row;
    while (isValidMove(tetromino.matrix, row + 1, tetromino.col)) {
      row++;
    }
    tetromino.row = row;
    placeTetromino();
    return;
  }

  if (e.which === 38) {
    const matrix = rotate(tetromino.matrix);
    const col = tetromino.col;

    if (isValidMove(matrix, tetromino.row, col)) {
      tetromino.matrix = matrix;
    }
  }

  if (e.which === 40) {
    const row = tetromino.row + 1;

    if (!isValidMove(tetromino.matrix, row, tetromino.col)) {
      tetromino.row = row - 1;

      placeTetromino();
      return;
    }

    tetromino.row = row;
  }
}

function doMainActions() {
  generatePlayfield();
  generateSequence();
  tetromino = getNextTetromino();
  drawNextPiece();
}

function prepareGame(e) {
  const playerScore = localStorage.getItem('playerScore');

  if (playerScore) {
    score = parseInt(playerScore);
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = `Счет: ${score}`;
  }

  bgMusic.volume = 0.6;
  doMainActions();
}

function startGame() {
  startBtn.setAttribute('disabled', 'disabled');
}

function restartGame() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  gameOver = false;
  startBtn.setAttribute('disabled', 'disabled');

  doMainActions();
}

document.addEventListener('keydown', moveTetromino);

// Загрузка счета из предыдущей сессии, если она не была завершена, и вызов функции отображения следующего тетромино при загрузке страницы
window.addEventListener('load', prepareGame);

startBtn.addEventListener('click', () => {
  if (gameOver) {
    restartGame();
  } else {
    startGame();
  }

  gameProcessBtn.removeAttribute('disabled');
  soundBtn.removeAttribute('disabled');
  ghostBtn.removeAttribute('disabled');
  holdBtn.removeAttribute('disabled')

  bgMusic.play();
  updateSpeed(1);
  rAF = requestAnimationFrame(loop);
});

document.addEventListener('keydown', function (e) {
  if (e.which === 80) { // Код клавиши "P"
    togglePause();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.which === 77) { // Код клавиши "M"
    toggleSound();
  }
});

gameProcessBtn.addEventListener('click', togglePause);
soundBtn.addEventListener('click', toggleSound);
ghostBtn.addEventListener('click', toggleGhost);
holdBtn.addEventListener('click', holdTetromino);