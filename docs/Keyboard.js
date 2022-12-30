// class for digital keyboard
class Keyboard {
  constructor(h) {
    this.qwerty = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]; // top row
    this.asdf = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]; // middle row
    this.zxcv = ["Z", "X", "C", "V", "B", "N", "M"]; // bottom row
    this.height = h; // height of the keyboard
    this.tileWidth = (h * 2) / 9; // width of each key
    this.tileHeight = h / 4; // height of each key
  }

  // show the keyboard, the keyboard is made of DOM buttons which do
  // not need to be redrawn. This should only be called once.
  show() {
    // make top row
    for (let i = 0; i < this.qwerty.length; i++) {
      let l = this.qwerty[i];
      let k = createButton(l);
      k.mouseClicked(function () {
        game.keyPressed(l);
      });
      k.size(this.tileWidth, this.tileHeight);
      k.position(
        width * ((0.8 / this.qwerty.length) * i + i / 100 + 1 / 14),
        415
      );
    }
    // make middle row
    for (let i = 0; i < this.asdf.length; i++) {
      let l = this.asdf[i];
      let k = createButton(l);
      k.mouseClicked(function () {
        game.keyPressed(l);
      });
      k.size(this.tileWidth, this.tileHeight);
      k.position(
        width * ((0.8 / this.qwerty.length) * i + i / 100 + 1 / 8.7),
        455
      );
    }
    // make bottom row
    for (let i = 0; i < this.zxcv.length; i++) {
      let l = this.zxcv[i];
      let k = createButton(l);
      k.mouseClicked(function () {
        game.keyPressed(l);
      });
      k.size(this.tileWidth, this.tileHeight);
      k.position(
        width * ((0.8 / this.qwerty.length) * i + i / 100 + 1 / 4.85),
        495
      );
    }
    // non-letter keys
    let enter = createButton("ENTER");
    enter.mouseClicked(function () {
      game.keyPressed("ENTER");
    });
    enter.size(this.tileWidth * 1.75, this.tileHeight);
    enter.position(21, 495);
    let del = createButton("⌫");
    del.mouseClicked(function () {
      game.keyPressed("⌫");
    });
    del.size(this.tileWidth * 1.75, this.tileHeight);
    del.position(334.5, 495);
  }
}
