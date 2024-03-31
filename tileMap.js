export default class TileMap {
    constructor(canvas, context, rows, columns) {
        this.tileSize = 50;

        //Dimensions
        this.rows = rows;
        this.columns = columns;
        this.width = this.columns * this.tileSize;
        this.height = this.rows * this.tileSize;

        // Buffer canvas element is needed to draw map and obstacles on it.
        // After drawing on a buffer canvas element we can crop parts of it(as we do with sprite sheets) and draw on another canvas.
        // By doing this we draw cropped part of buffer once in game loop instead of drawing many tiles on every game loop iteration.
        this.buffer = document.createElement('canvas').getContext('2d', { alpha:false, desynchronized:true });
        this.buffer.canvas.width = this.width;
        this.buffer.canvas.height = this.height;

        this.image = document.getElementById('tile');
    }

    // This method draws a map consisting of tiles on a buffer canvas and then returns the buffer canvas element so that it can be used in game loop.
    generate() {
        for (let top = 0; top < this.height; top += this.tileSize) {
          for (let left = 0; left < this.width; left += this.tileSize) {
            this.buffer.drawImage(this.image, left, top, this.tileSize, this.tileSize);
          }
        }

        return this.buffer.canvas;
    }
}