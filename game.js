import { BoardTetris } from "./boardTetris.js";
import { TetrominoBag } from "./tetromino.js";

export class Game {
  constructor(canvas, rows, cols, cellsize, space) {
    this.boardTetris = new BoardTetris(canvas, rows, cols, cellsize, space);
    this.tetrominoBag = new TetrominoBag(canvas, cellsize);
    this.currentTetromino = null;
    this.nextTetromino = null;

    this.keys = { up: false, down: false };

    this.baseDropInterval = 1000;
    this.minDropInterval = 120;
    this.renderInterval = 50;
    this.softDropInterval = 50;
    this.linesPerLevel = 10;
    this.dropInterval = this.baseDropInterval;
    this.lastDropTime = 0;
    this.lastRenderTime = 0;
    this.lastSoftDropTime = 0;

    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.highScore = 0;
    this.isPaused = false;
    this.isGameOver = false;

    this.preview = {
      canvas: document.getElementById("canvas-next"),
      ctx: null,
      rows: 4,
      cols: 4,
      cellsize: Math.max(12, Math.floor(cellsize * 0.6)),
      space: 2,
    };

    this.ui = {
      score: document.getElementById("score"),
      lines: document.getElementById("lines"),
      level: document.getElementById("level"),
      highScore: document.getElementById("high-score"),
      overlayGameOver: document.getElementById("overlay-gameover"),
      overlayPaused: document.getElementById("overlay-paused"),
      restartBtn: document.getElementById("btn-restart"),
    };

    this.bindUi();
    this.loadHighScore();
    this.keyBoard();
    this.reset();
  }

  bindUi() {
    if (this.ui.restartBtn) {
      this.ui.restartBtn.addEventListener("click", () => {
        this.reset();
      });
    }
    if (this.preview.canvas) {
      this.preview.ctx = this.preview.canvas.getContext("2d");
      this.preview.canvas.width =
        this.preview.cols * this.preview.cellsize +
        this.preview.cols * this.preview.space;
      this.preview.canvas.height =
        this.preview.rows * this.preview.cellsize +
        this.preview.rows * this.preview.space;
    }
  }

  loadHighScore() {
    const stored = window.localStorage.getItem("tetris_high_score");
    this.highScore = stored ? Number(stored) || 0 : 0;
  }

  updateHighScore() {
    if (this.score <= this.highScore) {
      return;
    }
    this.highScore = this.score;
    window.localStorage.setItem("tetris_high_score", String(this.highScore));
  }

  formatValue(value, size) {
    return String(value).padStart(size, "0");
  }

  syncUi() {
    if (this.ui.score) {
      this.ui.score.textContent = this.formatValue(this.score, 6);
    }
    if (this.ui.lines) {
      this.ui.lines.textContent = this.formatValue(this.lines, 3);
    }
    if (this.ui.level) {
      this.ui.level.textContent = this.formatValue(this.level, 2);
    }
    if (this.ui.highScore) {
      this.ui.highScore.textContent = this.formatValue(this.highScore, 6);
    }
  }

  updateOverlays() {
    if (this.ui.overlayGameOver) {
      this.ui.overlayGameOver.hidden = !this.isGameOver;
    }
    if (this.ui.overlayPaused) {
      this.ui.overlayPaused.hidden = !this.isPaused;
    }
  }

  resetTimers() {
    const now = Date.now();
    this.lastDropTime = now;
    this.lastRenderTime = now;
    this.lastSoftDropTime = now;
  }

  reset() {
    this.boardTetris.restartMatriz();
    this.tetrominoBag.fillBag();
    this.currentTetromino = this.tetrominoBag.nextTetromino();
    this.nextTetromino = this.tetrominoBag.nextTetromino();
    if (this.currentTetromino) {
      this.currentTetromino.reset();
    }
    if (this.nextTetromino) {
      this.nextTetromino.reset();
    }

    this.score = 0;
    this.lines = 0;
    this.level = 1;
    this.dropInterval = this.baseDropInterval;
    this.isPaused = false;
    this.isGameOver = false;
    this.keys.up = false;
    this.keys.down = false;

    this.resetTimers();
    this.syncUi();
    this.updateOverlays();
    this.drawNextPreview();
  }

  update() {
    const currentTime = Date.now();

    if (!this.isPaused && !this.isGameOver) {
      const dropElapsed = currentTime - this.lastDropTime;
      if (dropElapsed >= this.dropInterval) {
        this.autoMoveTetrominoDown();
        this.lastDropTime = currentTime;
      }
      if (this.keys.down) {
        const softElapsed = currentTime - this.lastSoftDropTime;
        if (softElapsed >= this.softDropInterval) {
          this.moveTetrominoDown();
          this.lastSoftDropTime = currentTime;
        }
      }
    }

    const renderElapsed = currentTime - this.lastRenderTime;
    if (renderElapsed >= this.renderInterval) {
      this.boardTetris.draw();
      if (!this.isGameOver && this.currentTetromino) {
        this.currentTetromino.draw(this.boardTetris);
      }
      this.lastRenderTime = currentTime;
    }
  }

  autoMoveTetrominoDown() {
    if (!this.currentTetromino) {
      return;
    }
    this.currentTetromino.move(1, 0);

    if (this.blockedTetromino()) {
      this.currentTetromino.move(-1, 0);
      this.placeTetromino();
    }
  }

  blockedTetromino() {
    const tetrominoPosiitons = this.currentTetromino.currentPosition();
    for (let i = 0; i < tetrominoPosiitons.length; i++) {
      if (
        !this.boardTetris.isEmpty(
          tetrominoPosiitons[i].row,
          tetrominoPosiitons[i].column
        )
      ) {
        return true;
      }
    }
    return false;
  }

  moveTetrominoLeft() {
    this.currentTetromino.move(0, -1);
    if (this.blockedTetromino()) {
      this.currentTetromino.move(0, 1);
    }
  }

  moveTetrominoRight() {
    this.currentTetromino.move(0, 1);
    if (this.blockedTetromino()) {
      this.currentTetromino.move(0, -1);
    }
  }

  moveTetrominoDown() {
    this.currentTetromino.move(1, 0);
    if (this.blockedTetromino()) {
      this.currentTetromino.move(-1, 0);
      return false;
    }
    return true;
  }

  rotationTetrominoCW() {
    const previousRotation = this.currentTetromino.rotation;
    this.currentTetromino.rotation++;
    if (
      this.currentTetromino.rotation >
      this.currentTetromino.shapes.length - 1
    ) {
      this.currentTetromino.rotation = 0;
    }
    if (this.blockedTetromino()) {
      this.currentTetromino.rotation = previousRotation;
    }
  }

  rotationTetrominoCCW() {
    const previousRotation = this.currentTetromino.rotation;
    this.currentTetromino.rotation--;
    if (this.currentTetromino.rotation < 0) {
      this.currentTetromino.rotation = this.currentTetromino.shapes.length - 1;
    }
    if (this.blockedTetromino()) {
      this.currentTetromino.rotation = previousRotation;
    }
  }

  hardDrop() {
    if (!this.currentTetromino) {
      return;
    }
    let steps = 0;
    while (true) {
      this.currentTetromino.move(1, 0);
      if (this.blockedTetromino()) {
        this.currentTetromino.move(-1, 0);
        break;
      }
      steps++;
    }
    if (steps > 0) {
      this.score += steps * 2;
      this.updateHighScore();
      this.syncUi();
    }
    this.placeTetromino();
  }

  placeTetromino() {
    const tetrominoPosition = this.currentTetromino.currentPosition();
    for (let i = 0; i < tetrominoPosition.length; i++) {
      if (tetrominoPosition[i].row < 0) {
        this.endGame();
        return;
      }
    }
    for (let i = 0; i < tetrominoPosition.length; i++) {
      this.boardTetris.matriz[tetrominoPosition[i].row][
        tetrominoPosition[i].column
      ] = this.currentTetromino.id;
    }

    const cleared = this.boardTetris.clearFullRows();
    if (cleared > 0) {
      this.updateScore(cleared);
    }

    if (this.boardTetris.gameOver()) {
      this.endGame();
      return;
    }

    this.currentTetromino = this.nextTetromino;
    if (this.currentTetromino) {
      this.currentTetromino.reset();
    }
    this.nextTetromino = this.tetrominoBag.nextTetromino();
    if (this.nextTetromino) {
      this.nextTetromino.reset();
    }
    this.resetTimers();
    this.drawNextPreview();
  }

  updateScore(linesCleared) {
    const lineScores = [0, 100, 300, 500, 800];
    const baseScore = lineScores[linesCleared] || linesCleared * 200;
    this.score += baseScore * this.level;
    this.lines += linesCleared;
    this.updateLevel();
    this.updateHighScore();
    this.syncUi();
  }

  updateLevel() {
    const nextLevel = Math.floor(this.lines / this.linesPerLevel) + 1;
    if (nextLevel !== this.level) {
      this.level = nextLevel;
      const speedUp = (this.level - 1) * 80;
      this.dropInterval = Math.max(
        this.minDropInterval,
        this.baseDropInterval - speedUp
      );
    }
  }

  endGame() {
    this.isGameOver = true;
    this.isPaused = false;
    this.keys.up = false;
    this.keys.down = false;
    this.updateHighScore();
    this.syncUi();
    this.updateOverlays();
  }

  togglePause() {
    if (this.isGameOver) {
      return;
    }
    this.isPaused = !this.isPaused;
    this.keys.up = false;
    this.keys.down = false;
    this.resetTimers();
    this.updateOverlays();
  }

  getPalette(id) {
    const reference = this.currentTetromino || this.nextTetromino;
    if (reference && typeof reference.getColorPalette === "function") {
      return reference.getColorPalette(id);
    }
    return {
      rightTriangle: "#B5193B",
      leftTriangle: "#FFFFFF",
      square: "#EE1B2E",
    };
  }

  drawPreviewSquare(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
  }

  drawPreviewTriangle(ctx, x1, y1, x2, y2, x3, y3, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  drawPreviewBlock(x, y, size, id) {
    if (!this.preview.ctx) {
      return;
    }
    const ctx = this.preview.ctx;
    const margin = size / 8;
    const palette = this.getPalette(id);
    this.drawPreviewTriangle(
      ctx,
      x,
      y,
      x + size,
      y,
      x,
      y + size,
      palette.leftTriangle
    );
    this.drawPreviewTriangle(
      ctx,
      x + size,
      y,
      x + size,
      y + size,
      x,
      y + size,
      palette.rightTriangle
    );
    this.drawPreviewSquare(
      ctx,
      x + margin,
      y + margin,
      size - margin * 2,
      palette.square
    );
  }

  drawNextPreview() {
    if (!this.preview.ctx || !this.nextTetromino) {
      return;
    }
    const ctx = this.preview.ctx;
    const width = this.preview.canvas.width;
    const height = this.preview.canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#05070b";
    ctx.fillRect(0, 0, width, height);

    const shape = this.nextTetromino.currenShape();
    let minRow = Infinity;
    let maxRow = -Infinity;
    let minCol = Infinity;
    let maxCol = -Infinity;
    shape.forEach((pos) => {
      minRow = Math.min(minRow, pos.row);
      maxRow = Math.max(maxRow, pos.row);
      minCol = Math.min(minCol, pos.column);
      maxCol = Math.max(maxCol, pos.column);
    });

    const shapeWidth = maxCol - minCol + 1;
    const shapeHeight = maxRow - minRow + 1;
    const offsetCol = Math.floor((this.preview.cols - shapeWidth) / 2) - minCol;
    const offsetRow = Math.floor((this.preview.rows - shapeHeight) / 2) - minRow;

    shape.forEach((pos) => {
      const x =
        (pos.column + offsetCol) *
        (this.preview.cellsize + this.preview.space);
      const y =
        (pos.row + offsetRow) * (this.preview.cellsize + this.preview.space);
      this.drawPreviewBlock(x, y, this.preview.cellsize, this.nextTetromino.id);
    });
  }

  keyBoard() {
    window.addEventListener("keydown", (evt) => {
      const code = evt.code;
      if (code === "KeyP") {
        this.togglePause();
        return;
      }
      if (code === "KeyR") {
        this.reset();
        return;
      }
      if (
        code === "ArrowLeft" ||
        code === "ArrowRight" ||
        code === "ArrowUp" ||
        code === "ArrowDown" ||
        code === "Space"
      ) {
        evt.preventDefault();
      }
      if (this.isPaused || this.isGameOver) {
        return;
      }
      if (code === "ArrowLeft") {
        this.moveTetrominoLeft();
      }
      if (code === "ArrowRight") {
        this.moveTetrominoRight();
      }
      if (code === "ArrowUp" && !this.keys.up) {
        this.rotationTetrominoCW();
        this.keys.up = true;
      }
      if (code === "ArrowDown") {
        this.keys.down = true;
      }
      if (code === "Space") {
        this.hardDrop();
      }
    });
    window.addEventListener("keyup", (evt) => {
      const code = evt.code;
      if (code === "ArrowUp") {
        this.keys.up = false;
      }
      if (code === "ArrowDown") {
        this.keys.down = false;
      }
    });
  }
}
