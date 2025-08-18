import { BoardTetris } from "./boardTetris.js";
import { TetrominoBag, Tetromino, TetrominoTypes } from "./tetromino.js";

export class Game {
  constructor(canvas, rows, cols, cellsize, space) {
    this.boardTetris = new BoardTetris(canvas, rows, cols, cellsize, space);
    this.tetrominoBag = new TetrominoBag(canvas, cellsize);
    this.currentTetromino = this.tetrominoBag.nextTetromino();
    this.keyBoard();
    this.lastTime = 0;
    this.lastTime2 = 0;
    this.keys = { up: false, down: false };
  }
  update() {
    let currentTime = Date.now();
    let curTime = currentTime - this.lastTime;
    let curTime2 = currentTime - this.lastTime2;

    if (curTime >= 1000) {
      this.autoMoveTetrominoDown();
      this.lastTime = currentTime;
    }
    if (curTime2 >= 50) {
      this.boardTetris.draw();
      this.currentTetromino.draw(this.boardTetris);
      if (this.keys.down) {
        this.moveTetrominoDown();
      }
      this.lastTime2 = currentTime;
    }
  }

  autoMoveTetrominoDown() {
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
    }
  }
  rotationTetrominoCW() {
    this.currentTetromino.rotation++;
    if (
      this.currentTetromino.rotation >
      this.currentTetromino.shapes.length - 1
    ) {
      this.currentTetromino.rotation = 0;
    }
    if (this.blockedTetromino()) {
      this.rotationTetrominoCCW();
    }
  }
  rotationTetrominoCCW() {
    this.currentTetromino.rotation--;
    if (this.currentTetromino.rotation < 0) {
      this.currentTetromino.rotation = this.currentTetromino.shapes.length - 1;
    }
    if (this.blockedTetromino()) {
      this.rotationTetrominoCW();
    }
  }

  placeTetromino() {
    const tetrominoPosition = this.currentTetromino.currentPosition();
    for (let i = 0; i < tetrominoPosition.length; i++) {
      this.boardTetris.matriz[tetrominoPosition[i].row][
        tetrominoPosition[i].column
      ] = this.currentTetromino.id;
    }
    if (this.boardTetris.gameOver()) {
      return true;
    } else {
      this.boardTetris.clearFullRows();
      this.currentTetromino = this.tetrominoBag.nextTetromino();
    }
  }
  keyBoard() {
    window.addEventListener("keydown", (evt) => {
      if (evt.key === "ArrowLeft") {
        this.moveTetrominoLeft();
      }
      if (evt.key === "ArrowRight") {
        this.moveTetrominoRight();
      }
      if (evt.key === "ArrowUp" && !this.keys.up) {
        this.rotationTetrominoCW();
        this.keys.up = true;
      }
      if (evt.key === "ArrowDown") {
        this.keys.down = true;
      }
    });
    window.addEventListener("keyup", (evt) => {
      if (evt.key === "ArrowUp") {
        this.keys.up = false;
      }
      if (evt.key === "ArrowDown") {
        this.keys.down = false;
      }
    });
  }
}
