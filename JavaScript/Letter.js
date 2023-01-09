// class representing a letter tile
class Letter {
  constructor(x, y, size) {
    this.letterIndex = 26; // starts blank
    this.color = 0; // color index 0-3: light grey, dark grey, yellow, green
    this.x = x; // x coordinate within canvas
    this.y = y; // y coordinate within canvas
    this.size = size; // size of the tiles
    this.create();
  }

  // create invisible clickable divs for the tile
  create() {
    let tile = createDiv("");
    tile.size(this.size, this.size);
    tile.position(this.x, this.y);
    // when clicked pass to click function for color changing
    tile.mouseClicked(() => this.clicked());
    // set parent for relative position and scaling
    tile.parent("sketch");
    return tile;
  }

  // update the letter of the tile
  update(index) {
    this.letterIndex = index;
  }

  // update color
  clicked() {
    this.setColor((this.color + 1) % 4);
    this.update(this.letterIndex);
  }

  // get the color of the tile
  getColor() {
    return this.color;
  }

  // set the color of the tile
  setColor(colorIndex) {
    this.color = colorIndex;
  }

  // reset color to 0
  resetColor() {
    this.color = 0;
    this.update(this.letterIndex);
  }

  // draw the tile on screen
  draw() {
    // get tile image from preloaded image list
    let tileImage = letters[this.letterIndex * 4 + this.color];
    image(tileImage, this.x, this.y, this.size, this.size);
  }
}
