// class that creates a digital keyboard
class Keyboard {
  constructor(hardleGame) {
    this.qwerty = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]; // top row
    this.asdf = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]; // middle row
    this.zxcv = ["Z", "X", "C", "V", "B", "N", "M"]; // bottom row
    this.height = 140; // height of the keyboard
    this.tileWidth = (this.height * 2) / 9; // width of each key
    this.tileHeight = this.height / 4; // height of each key
    this.create(hardleGame); // build the keyboard
  }

  // show the keyboard, the keyboard is made of DOM element buttons which do
  // not need to be redrawn. This should only be called once.
  create(hardleGame) {
    let keyboard = createElement("keyboard");
    keyboard.parent("sketch");
    // make top row
    for (let i = 0; i < this.qwerty.length; i++) {
      let l = this.qwerty[i];
      let k = createButton(l);
      k.style("color", "black");
      // on click pass letter to game
      k.mouseClicked(() => hardleGame.keyPressed(l));
      k.size(this.tileWidth, this.tileHeight);
      k.position(
        width * ((0.8 / this.qwerty.length) * i + i / 100 + 1 / 17),
        410
      );
      // set ID and parent
      k.id(l);
      k.parent(keyboard);
    }
    // make middle row
    for (let i = 0; i < this.asdf.length; i++) {
      let l = this.asdf[i];
      let k = createButton(l);
      k.id(l);
      k.style("color", "black");
      // on click pass letter to game
      k.mouseClicked(() => hardleGame.keyPressed(l));

      k.size(this.tileWidth, this.tileHeight);
      k.position(
        width * ((0.8 / this.qwerty.length) * i + i / 100 + 1 / 9.8),
        450
      );
      // set parent for organization
      k.parent(keyboard);
    }
    // make bottom row
    for (let i = 0; i < this.zxcv.length; i++) {
      let l = this.zxcv[i];
      let k = createButton(l);
      k.id(l);
      k.style("color", "black");
      // on click pass letter to game
      k.mouseClicked(() => hardleGame.keyPressed(l));
      k.size(this.tileWidth, this.tileHeight);
      k.position(
        width * ((0.8 / this.qwerty.length) * i + i / 100 + 1 / 5.2),
        490
      );
      // set parent for organization
      k.parent(keyboard);
    }
    // non-letter keys
    let enter = createButton("ENTER");
    enter.style("color", "black");
    // on click pass ENTER to game
    enter.mouseClicked(() => hardleGame.keyPressed("ENTER"));
    enter.size(this.tileWidth * 2, this.tileHeight);
    enter.position(10, 490);
    // set parent for organization
    enter.parent(keyboard);
    let del = createButton("⌫");
    del.style("color", "black");
    // on click pass ⌫ to game
    del.mouseClicked(() => hardleGame.keyPressed("⌫"));
    del.size(this.tileWidth * 2, this.tileHeight);
    del.position(329, 490);
    // set parent for organization
    del.parent(keyboard);
  }
}
