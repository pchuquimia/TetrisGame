import { Grid } from "./grid.js";
import { BoardTetris } from "./boardTetris.js";
import { Game } from "./game.js";
const canvasTetris = document.getElementById("canvas-tetris");
const rows = 20;
const cols = 10;
const cellsize = 26;
const space = 2;
const game = new Game(canvasTetris, rows, cols, cellsize, space);
function update() {
  game.update();
  requestAnimationFrame(update);
}
update();
