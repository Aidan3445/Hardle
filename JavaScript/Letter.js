// class representing a letter tile
class Letter {
  constructor(x, y, size) {
    this.letterIndex = 26; // starts blank
    this.color = 0; // color index 0-3: light grey, dark grey, yellow, green
    this.x = x;
    this.y = y;
    this.size = size;
    this.tile = this.create();
  }

  // draw the letter at x, y with given size
  create() {
    let path = this.getImage();
    let tile = createImg(path, "");
    tile.id(str(this.x) + str(this.y));
    tile.size(this.size, this.size);
    tile.position(this.x, this.y);
    tile.mouseClicked(() => this.clicked());
    tile.parent("sketch");
    return tile;
  }

  // convert letterindex to character
  getImage() {
    let letter = alphabet[this.letterIndex];
    let colorLetter = ["l", "d", "y", "g"][this.color];
    let path = "/images/tiles/" + letter + "_" + colorLetter + ".png";
    return path;
  }

  // update the letter of the tile
  update(index) {
    this.letterIndex = index;
    this.tile = document.getElementById(str(this.x) + str(this.y));
    this.tile.remove();
    this.tile = this.create();
  }

  // update color
  clicked() {
    this.color = (this.color + 1) % 4;
    this.update(this.letterIndex);
  }

  // reset color to 0
  resetColor() {
    this.color = 0;
  }
}
