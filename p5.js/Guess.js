// class for guesses
class WordGuess {
  constructor(wordleWord) {
    this.word = []; // list of charaters/string-letters in the guess
    this.guessed = false; // has the word been guessed or is it being played currently
    this.secretWord = wordleWord.split(""); //  list of charaters/string-letters in the secret word
    this.pegs = new Pegs(0, 0); // pegs start off as blank
    this.win = false; // has the game been won?
    this.tiles = []; // list of letter tiles to display
    this.setup();
  }
  
  // setup a new guess
  setup() {
    let tiles = [];
    for (let i = 0; i < 5; i++) {
      tiles.push(new Letter());
    }
    this.tiles = tiles;
  }

  // add a letter to the guess
  addLetter(letter) {
    if (this.word.length < this.secretWord.length &&
        alphabet.indexOf(letter) != -1) {
      this.word.push(letter);
    }
  }

  // delete a letter from the guess
  deleteLetter() {
    this.word.pop();
    this.tiles[this.word.length].update(26);
  }

  // update the guess for drawing
  update(letterIndex, wordIndex, tileSize) {
    let letter;
    if (this.word.length > letterIndex) {
      letter = this.word[letterIndex];
    } else {
      letter = " ";
    }
    let b = this.tiles[letterIndex];
    let index = alphabet.indexOf(letter);
    if (index != -1) {
      b.update(index);
    }
    this.show(wordIndex, tileSize);
  }

  // draw the guess tiles
  show(wordIndex, tileSize) {
    for (let i = 0; i < 5; i++) {
      let x = width / 2 - tileSize * 3.5 + i * tileSize * 1.1 + width / 25;
      let y = (wordIndex * tileSize * 11) / 10 + tileSize / 3;
      let t = this.tiles[i];
      t.show(x, y, tileSize);
    }
  }
  
  // passes clicks onto the tiles
  clicked(x, y) {
    for (let t of this.tiles) {
        t.clicked(x, y);
    }
  }
  
  // reset colors of all tiles in the guess
  resetColors() {
    for (let i = 0; i < 5; i++) {
      this.tiles[i].resetColor();
    }
  }

  // get the pegs for the current guess based on the secret word
  getPegs() {
    let yellow = 0;
    let green = 0;
    let g = [].concat(this.word);
    let s = [].concat(this.secretWord);
    for (let i = 0; i < s.length; i++) {
      if (g[i] == s[i]) {
        green++;
        g[i] = "0";
        s[i] = "1";
      }
    }
    for (let i = 0; i < s.length; i++) {
      if (g.indexOf(s[i]) != -1) {
        yellow++;
        g[g.indexOf(s[i])] = "0";
        s[i] = "1";
      }
    }
    if (green == 5) {
      this.win = true;
    }
    this.pegs = new Pegs(yellow, green, this.guessed);
  }
  
  // make a guess if the word is valid, otherwise alert that the word is invalid
  guessMade(wordLength, allWords) {
    let string = "";
    for (let s of this.word) {
      string += s;
    }
    if (this.word.length == wordLength && allWords.indexOf(string) != -1) {
      this.guessed = true;
      this.getPegs();
    } else if (this.word.length == wordLength) {
      let invalid = createButton("Not in the word list.");
      invalid.position(120, 50);
      invalid.style("font-size", "20");
      invalid.size(150, 25);
      invalid.mousePressed(() => invalid.remove());
      sleep(2500).then(() => invalid.remove());
    }
    return this.guessed;
  }

  // convert guess object to json
  static toJSON(obj) {
    let json = {
      word: obj.word,
      guessed: obj.guessed,
      secretWord: obj.secretWord,
      win: obj.win,
    };
    return json;
  }

  // create guess object from json
  static fromJSON(json) {
    let wg = new WordGuess("XXXXX");
    wg.word = json.word;
    wg.guessed = json.guessed;
    wg.secretWord = json.secretWord;
    wg.win = json.win;
    wg.getPegs()
    return wg;
  }
}

// class for the color pegs of a guess based on the closeness to the secret word
class Pegs {
  constructor(y, g, guessed) {
    this.colors = [ // pegs start out all white
      color("white"),
      color("white"),
      color("white"),
      color("white"),
      color("white"),
    ]; 
    for (let i = 0; i < y; i++) { // replace the first y# pegs with yellow
      this.colors[i] = color(255, 224, 71);
    }
    for (let i = 0; i < g; i++) { // replace the next g# pegs with green
      this.colors[i + y] = color(78, 153, 40);
    }
    if (guessed) {
      for (let i = 0; i < 5 - y - g; i++) { // if guessed then remaining pegs are grey
        this.colors[i + y + g] = color(175, 175, 175)
      }
    }
  }

  // draw pegs in the pentagon
  draw(index, tileSize) {
    let x = width / 2 + 2.8 * tileSize;
    let y = (index * tileSize * 11) / 10 + tileSize / 1.2;
    for (let i = 0; i < this.colors.length; i++) {
      push();
      ellipseMode(CENTER);
      fill(this.colors[i]);
      translate(p5.Vector.fromAngle(((2 * PI) / 5) * (i - 1.25), 10));
      ellipse(x, y, tileSize / 5, tileSize / 5);
      pop();
    }
  }

  // convert to json
  static toJSON(obj) {
    let y = 0;
    let g = 0;
    for (let i of obj.colors) {
      if (i.levels[1] == 224) {
        y++;
      } else if (i.levels[1] == 153) {
        g++;
      }
    }
    let json = {
      y: y,
      g: g,
    };
    return json;
  }

  // create pegs from json
  static fromJSON(json) {
    let p = new Pegs(json.y, json.g);
    return p;
  }
}