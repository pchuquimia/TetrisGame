class Position {
  constructor(row, column) {
    this.row = row;
    this.column = column;
  }
}
class Tetromino {
  constructor(canvas, shapes, cellsize, initPosition, id) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.shapes = shapes;
    this.id = id;
    this.cellsize = cellsize;
    this.initPosition = initPosition;
    this.rotation = 0;
    this.position = new Position(
      this.initPosition.row,
      this.initPosition.column
    );
  }
  drawSquare(x, y, size, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, size, size);
  }
  drawTriangle(x1, y1, x2, y2, x3, y3, color) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.closePath();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }
  getColorPalette(id) {
    const palette = {
      1: {
        rightTriangle: "#B5193B",
        leftTriangle: "#FFFFFF",
        square: " #EE1B2E",
      },
      2: {
        rightTriangle: "#FE5E02",
        leftTriangle: "#FFFFFF",
        square: " #FE8602",
      },
      3: {
        rightTriangle: "#B5193B",
        leftTriangle: "#FFFFFF",
        square: " #FE8602",
      },
      4: {
        rightTriangle: "#22974C",
        leftTriangle: "#FFFFFF",
        square: " #24DC4F",
      },
      5: {
        rightTriangle: "#49BDFF",
        leftTriangle: "#FFFFFF",
        square: " #2D97F7",
      },
      6: {
        rightTriangle: "#0000C9",
        leftTriangle: "#FFFFFF",
        square: " #0101F0",
      },
      7: {
        rightTriangle: "#8500D3",
        leftTriangle: "#FFFFFF",
        square: " #A000F1",
      },
    };
    return palette[id] || palette[1];
  }
  drawBlock(x, y, id) {
    const margin = this.cellsize / 8;
    const palette = this.getColorPalette(id);
    this.drawTriangle(
      x,
      y,
      x + this.cellsize,
      y,
      x,
      y + this.cellsize,
      palette.leftTriangle
    );
    this.drawTriangle(
      x + this.cellsize,
      y,
      x + this.cellsize,
      y + this.cellsize,
      x,
      y + this.cellsize,
      palette.rightTriangle
    );
    this.drawSquare(
      x + margin,
      y + margin,
      this.cellsize - margin * 2,
      palette.square
    );
  }
  currentShape() {
    return this.shapes[this.rotation];
  }
  draw(grid) {
    const shape = this.currentShape();
    for (let i = 0; i < shape.length; i++) {
      const position = grid.getCoordenates(
        this.position.row + shape[i].row,
        this.position.column + shape[i].column
      );
      this.drawBlock(position.x, position.y, this.id);
    }
  }
  currentPosition() {
    const shape = this.currentShape();
    const positions = [];
    for (let i = 0; i < shape.length; i++) {
      positions.push(
        new Position(
          this.position.row + shape[i].row,
          this.position.column + shape[i].column
        )
      );
    }
    return positions;
  }
  move(row, col) {
    this.position.row = this.position.row + row;
    this.column.row = this.position.column + col;
  }
  reset() {
    this.rotation = 0;
    this.position = new Position(
      this.initPosition.row,
      this.initPosition.column
    );
  }
}
const TetrominoTypes = {
  T: {
    id: 1,
    initPosition: { row: 0, column: 3 },
    shapes: [
      [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 0, column: 2 },
        { row: 0, column: 3 },
      ],
      [
        { row: 0, column: 1 },
        { row: 1, column: 0 },
        { row: 1, column: 1 },
        { row: 1, column: 2 },
      ],
      [
        { row: 0, column: 1 },
        { row: 1, column: 1 },
        { row: 2, column: 1 },
        { row: 2, column: 2 },
      ],
      [
        { row: 1, column: 0 },
        { row: 1, column: 1 },
        { row: 1, column: 2 },
        { row: 2, column: 1 },
      ],
    ],
  },
  O: {
    id: 2,
    initPosition: { row: 0, column: 4 },
    shapes: [
      [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 1, column: 0 },
        { row: 1, column: 1 },
      ],
    ],
  },
  I: {
    id: 3,
    initPosition: { row: -1, column: 3 },
    shapes: [
      [
        { row: 1, column: 0 },
        { row: 1, column: 1 },
        { row: 1, column: 2 },
        { row: 1, column: 3 },
      ],
      [
        { row: 0, column: 2 },
        { row: 1, column: 2 },
        { row: 2, column: 2 },
        { row: 3, column: 2 },
      ],
      [
        { row: 2, column: 0 },
        { row: 2, column: 1 },
        { row: 2, column: 2 },
        { row: 2, column: 3 },
      ],
      [
        { row: 0, column: 1 },
        { row: 1, column: 1 },
        { row: 2, column: 1 },
        { row: 3, column: 1 },
      ],
    ],
  },
  S: {
    id: 4,
    initPosition: { row: 0, column: 3 },
    shapes: [
      [
        { row: 0, column: 1 },
        { row: 0, column: 2 },
        { row: 1, column: 0 },
        { row: 1, column: 1 },
      ],
      [
        { row: 0, column: 1 },
        { row: 1, column: 1 },
        { row: 1, column: 2 },
        { row: 2, column: 2 },
      ],
      [
        { row: 1, column: 1 },
        { row: 1, column: 2 },
        { row: 2, column: 0 },
        { row: 2, column: 1 },
      ],
      [
        { row: 0, column: 1 },
        { row: 1, column: 0 },
        { row: 1, column: 1 },
        { row: 2, column: 1 },
      ],
    ],
  },
  Z: {
    id: 5,
    initPosition: { row: 0, column: 3 },
    shapes: [
      [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 1, column: 1 },
        { row: 1, column: 2 },
      ],
      [
        { row: 0, column: 2 },
        { row: 1, column: 1 },
        { row: 1, column: 2 },
        { row: 2, column: 1 },
      ],
      [
        { row: 1, column: 0 },
        { row: 1, column: 1 },
        { row: 2, column: 1 },
        { row: 2, column: 2 },
      ],
      [
        { row: 0, column: 1 },
        { row: 1, column: 0 },
        { row: 1, column: 1 },
        { row: 2, column: 0 },
      ],
    ],
  },
  J: {
    id: 6,
    initPosition: { row: 0, column: 3 },
    shapes: [
      [
        { row: 0, column: 0 },
        { row: 1, column: 0 },
        { row: 1, column: 1 },
        { row: 1, column: 2 },
      ],
      [
        { row: 0, column: 1 },
        { row: 0, column: 2 },
        { row: 1, column: 1 },
        { row: 2, column: 1 },
      ],
      [
        { row: 1, column: 0 },
        { row: 1, column: 1 },
        { row: 1, column: 2 },
        { row: 2, column: 2 },
      ],
      [
        { row: 0, column: 1 },
        { row: 1, column: 1 },
        { row: 2, column: 0 },
        { row: 2, column: 1 },
      ],
    ],
  },
  L: {
    id: 7,
    initPosition: { row: 0, column: 3 },
    shapes: [
      [
        { row: 0, column: 2 },
        { row: 1, column: 0 },
        { row: 1, column: 1 },
        { row: 1, column: 2 },
      ],
      [
        { row: 0, column: 1 },
        { row: 1, column: 1 },
        { row: 2, column: 1 },
        { row: 2, column: 2 },
      ],
      [
        { row: 1, column: 0 },
        { row: 1, column: 1 },
        { row: 1, column: 2 },
        { row: 2, column: 0 },
      ],
      [
        { row: 0, column: 0 },
        { row: 0, column: 1 },
        { row: 1, column: 1 },
        { row: 2, column: 1 },
      ],
    ],
  },
};

class TetrominoBag {
  constructor(canvas, cellsize) {
    this.canvas = canvas;
    this.cellsize = cellsize;
    this.bag = [];
  }
  fillBag() {
    const tetrominoTypes = [
      TetrominoTypes.I,
      TetrominoTypes.J,
      TetrominoTypes.L,
      TetrominoTypes.O,
      TetrominoTypes.S,
      TetrominoTypes.T,
      TetrominoTypes.Z,
    ];
    this.bag.length = 0;
    tetrominoTypes.forEach((type) => {
      new Tetromino(
        this.canvas,
        type.shapes,
        this.cellsize,
        type.initPosition,
        type.id
      );
    });
    for (let i = this.bag.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
    }
  }
  nextTetromino() {
    if (this.bag.length === 0) {
      this.fillBag();
    }
    return this.bag.pop();
  }
}

export { Tetromino, TetrominoTypes, Position, TetrominoBag };


 blockedTetromino() {
    const tetrominoPosition = this.currentTetromino.currentPosition();
    console.log(tetrominoPosition);
    for (let i = 0; i < tetrominoPosition.length; i++) {
      if (
        !this.boardTetris.isEmpty(
          tetrominoPosition[i].row,
          tetrominoPosition[i].column
        )
      ) {
        return true;
      }
    }
    return false;
  }

  blockedTetromino() {
    const tetrominoPosition = this.currentTetromino.currentPosition();
    for (let i = tetrominoPosition.length; i >= 0; i--) {
      if (
        !this.boardTetris.isEmpty(
          tetrominoPosition[i].row,
          tetrominoPosition[i].column
        )
      ) {
        return true;
      }
    }
    return false;
  }


  fillBag(){
    const tetrominoTypes = [
          TetrominoTypes.I,
          TetrominoTypes.J,
          TetrominoTypes.L,
          TetrominoTypes.O,
          TetrominoTypes.S,
          TetrominoTypes.Z,
          TetrominoTypes.T,
        ];

      tetrominoTypes.forEach(type => {
        this.bag.push(
          new Tetromino(this.canvas,type.shapes,this.cellsize,type.initPosition,type.id)
        )
        
      for(let i=this.bag.length-1;i>0;i--){
        let j=Math.floor(Math.random*(i+1))
        [this.bag[i],this.bag[j]]=[this.bag[i],this.bag[j]]
      }
  }}