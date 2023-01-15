// class that creates a digital keyboard
class Keyboard {
  constructor(hardleGame) {
    this.qwerty = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]; // top row
    this.asdf = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]; // middle row
    this.zxcv = ["Z", "X", "C", "V", "B", "N", "M"]; // bottom row
    this.height = 140; // height of the keyboard
    this.tileWidth = (this.height * 2) / 9; // width of each key
    this.tileHeight = this.height / 4; // height of each key
    this.hardleGame = hardleGame;
    this.create(); // build the keyboard
  }

  // show the keyboard, the keyboard is made of transparent
  // DOM element buttons which do not need to be redrawn.
  // This should only be called once.
  create() {
    let keyboard = createElement("keyboard");
    keyboard.parent("sketch");
    // make top row
    for (let i = 0; i < this.qwerty.length; i++) {
      let l = this.qwerty[i];
      let k = createButton(l);
      k.style("color", "black");
      k.style("background-color", "transparent");
      k.style("border-radius", "10px");
      k.style("border-style", "solid");
      k.style("cursor", "pointer");
      // on click pass letter to game
      k.mouseClicked(() => this.hardleGame.keyPressed(l));
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
      k.style("color", "black");
      k.style("background-color", "transparent");
      k.style("border-radius", "10px");
      k.style( "border-style", "solid");
      k.style("cursor", "pointer");
      // on click pass letter to game
      k.mouseClicked(() => this.hardleGame.keyPressed(l));
      k.size(this.tileWidth, this.tileHeight);
      k.position(
        width * ((0.8 / this.qwerty.length) * i + i / 100 + 1 / 9.8),
        450
      );
      // set ID and parent
      k.id(l);
      k.parent(keyboard);
    }
    // make bottom row
    for (let i = 0; i < this.zxcv.length; i++) {
      let l = this.zxcv[i];
      let k = createButton(l);
      k.style("color", "black");
      k.style("background-color", "transparent");
      k.style("border-radius", "10px");
      k.style( "border-style", "solid");
      k.style("cursor", "pointer");
      // on click pass letter to game
      k.mouseClicked(() => this.hardleGame.keyPressed(l));
      k.size(this.tileWidth, this.tileHeight);
      k.position(
        width * ((0.8 / this.qwerty.length) * i + i / 100 + 1 / 5.2),
        490
      );
      // set ID and parent
      k.id(l);
      k.parent(keyboard);
    }
    // non-letter keys
    let enter = createButton("ENTER");
    enter.style("color", "black");
    enter.style("background-color", "rgb(185, 185, 185)");
    enter.style("border-radius", "10px");
    enter.style( "border-style", "solid");
    enter.style("cursor", "pointer");
    // on click pass ENTER to game
    enter.mouseClicked(() => this.hardleGame.keyPressed("ENTER"));
    enter.size(this.tileWidth * 2, this.tileHeight);
    enter.position(10, 490);
    // set ID and parent
    enter.id("enter");
    enter.parent(keyboard);
    let del = createButton("⌫");
    del.style("color", "black");
    del.style("background-color", "rgb(185, 185, 185)");
    del.style("border-radius", "10px");
    del.style( "border-style", "solid");
    del.style("cursor", "pointer");
    // on click pass ⌫ to game
    del.mouseClicked(() => this.hardleGame.keyPressed("⌫"));
    del.size(this.tileWidth * 2, this.tileHeight);
    del.position(329, 490);
    // set ID and parent
    del.id("del");
    del.parent(keyboard);
  }

  // draw colored rectangles underneath transparent buttons
  // color priorities: Green>Yellow>DarkGray>LightGray
  draw() {
    let lightgray = color(185, 185, 185);
    let darkgray = color(125, 125, 125);
    let yellow = color(255, 224, 71);
    let green = color(120, 215, 70);
    let colors = [lightgray, darkgray, yellow, green];
    // get unique tile colors
    let tileColors = this.hardleGame.getTileColors();
    // console.log(tileColors);
    push();
    noStroke();
    // draw top row
    for (let i = 0; i < this.qwerty.length; i++) {
      let l = this.qwerty[i];
      let colorIndex = 0;
      if (l in tileColors) {
        colorIndex = tileColors[l];
      }
      fill(colors[colorIndex]);
      rect(
        width * ((0.8 / this.qwerty.length) * i + i / 100 + 1 / 17),
        410,
        this.tileWidth,
        this.tileHeight,
        10
      );
    }
    // draw middle row
    for (let i = 0; i < this.asdf.length; i++) {
      let l = this.asdf[i];
      let colorIndex = 0;
      if (l in tileColors) {
        colorIndex = tileColors[l];
      }
      fill(colors[colorIndex]);
      rect(
        width * ((0.8 / this.qwerty.length) * i + i / 100 + 1 / 9.8),
        450,
        this.tileWidth,
        this.tileHeight,
        10
      );
    }
    // draw bottom row
    for (let i = 0; i < this.zxcv.length; i++) {
      let l = this.zxcv[i];
      let colorIndex = 0;
      if (l in tileColors) {
        colorIndex = tileColors[l];
      }
      fill(colors[colorIndex]);
      rect(
        width * ((0.8 / this.qwerty.length) * i + i / 100 + 1 / 5.2),
        490,
        this.tileWidth,
        this.tileHeight,
        10
      );
    }
    pop();
  }
}
