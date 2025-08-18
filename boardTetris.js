import { Grid } from "./grid.js";
export class BoardTetris extends Grid {
  constructor(canvas, rows, cols, cellsize, space) {
    super(canvas, rows, cols, cellsize, space);
  }
  isInside(row, col) {
    return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
  }
  isEmpty(row, col) {
    return this.isInside(row, col) && this.matriz[row][col] === 0;
  }
  isRowFull(row) {
    return this.matriz[row].every((element) => element !== 0);
  }
  isRowEmpty(row) {
    return this.matriz[row].every((element) => element === 0);
  }
  clearRow(row) {
    this.matriz[row].fill(0);
  }
  moveRowDown(row, moveRows) {
    this.matriz[row + moveRows] = this.matriz[row].slice();
    this.clearRow(row);
  }
  clearFullRows() {
    let cont = 0;
    for (let row = this.rows - 1; row >= 0; row--) {
      if (this.isRowFull(row)) {
        this.clearRow(row);
        cont++;
      } else if (cont > 0) {
        this.moveRowDown(row, cont);
      }
    }
    return cont;
  }
  gameOver() {
    return !this.isRowEmpty(0);
  }
}
