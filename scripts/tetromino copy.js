class Position {
  constructor(row, column) {
    this.row = row;
    this.column = column;
  }
}

class Tetromino {
  constructor(canvas, shape, cellsize, id, initPosition) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.shape = shape;
    this.cellsize = cellsize;
    this.id = id;
    this.initPosition = initPosition;
    this.rotation = 0;
    this.position = new Position(
      this.initPosition.row,
      this.initPosition.column
    );
  }
  drawSquare(x, y, side, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, side, side);
  }
  drawTriangle(x1, y1, x2, y2, x3, y3, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
  getColorPalette() {}
}
