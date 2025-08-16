import { BoardTetris } from "./boardTetris.js";

const canvasTetris = document.getElementById("canvas-tetris");

const rows = 16;
const cols = 10;
const space = 2;
const cellsize = 26;
const boardTetris = new BoardTetris(canvasTetris, rows, cols, space, cellsize);

function update() {
  boardTetris.draw();
  requestAnimationFrame(update);
}
update();
