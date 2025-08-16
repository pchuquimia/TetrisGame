export class Grid {
  constructor(canvas, rows, cols, space, cellsize) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.rows = rows;
    this.cols = cols;
    this.cellsize = cellsize;
    this.space = space;
    this.matriz = [];
    this.canvas.width = this.cols * this.cellsize + this.cols * this.space;
    this.canvas.height = this.rows * this.cellsize + this.rows * this.space;
    this.restartMatriz();
  }
  restartMatriz() {
    for (let r = 0; r < this.rows; r++) {
      this.matriz[r] = [];
      for (let c = 0; c < this.cols; c++) {
        this.matriz[r][c] = 0;
      }
    }
  }
  drawSquare(x, y, side, color, bordColor) {
    const bordSize = side / 10;
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, side, side);
    this.ctx.strokeStyle = bordColor;
    this.ctx.lineWidth = bordSize;
    this.ctx.strokeRect(
      x + bordSize / 2,
      y + bordSize / 2,
      side - bordSize,
      side - bordSize
    );
  }
  getCoordenates(row, col) {
    return {
      x: col * (this.cellsize + this.space),
      y: row * (this.cellsize + this.space),
    };
  }
  draw() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const position = this.getCoordenates(r, c);
        this.drawSquare(
          position.x,
          position.y,
          this.cellsize,
          "#000",
          "#303030"
        );
      }
    }
    this.printMatriz();
  }
  printMatriz() {
    let text = " ";
    this.matriz.forEach((row) => {
      text = text + row.join(" ") + "\n";
    });
    console.log(text);
  }
}
