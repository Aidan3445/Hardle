// class for guesses
class WordGuess {
  constructor(wordleWord, index, tileSize, word = []) {
    this.word = word; // list of charaters/string-letters in the guess
    this.index = index; // number of the guess
    this.guessed = false; // has the word been guessed or is it being played currently
    this.secretWord = wordleWord.split(""); //  list of charaters/string-letters in the secret word
    this.pegs = new Pegs(0, 0); // pegs start off as blank
    this.win = false; // has the game been won?
    this.tiles = []; // list of letter tiles to display
    this.tileSize = tileSize; // size of tiles
    this.setup();
  }

  // setup a new guess
  setup() {
    // create the letter tiles
    for (let i = 0; i < 5; i++) {
      let x =
        width / 2 - this.tileSize * 3.5 + i * this.tileSize * 1.1 + width / 25;
      let y = (this.index * this.tileSize * 11) / 10 + this.tileSize / 3;
      this.tiles.push(new Letter(x, y, this.tileSize));
    }
  }

  // add a letter to the guess
  addLetter(letter) {
    let index = alphabet.indexOf(letter);
    // make sure the letter is a valid letter
    if (
      this.word.length < this.secretWord.length &&
      index != -1 &&
      index != 26 // 26 is "_" and is for image loading only
    ) {
      let tile = this.tiles[this.word.length];
      tile.update(index);
      tile.resetColor();
      this.word.push(letter);
    }
  }

  // delete a letter from the guess
  deleteLetter() {
    this.word.pop();
    let tile = this.tiles[this.word.length];
    tile.update(26);
  }

  // reset colors of all tiles in the guess
  resetColors() {
    for (let i = 0; i < 5; i++) {
      this.tiles[i].resetColor();
    }
  }

  // clear the word
  clear() {
    this.word = []
    this.tiles = []
    this.setup();
  }

  // get the pegs for the current guess based on the secret word
  getPegs() {
    let yellow = 0; // number of yellow pegs
    let green = 0; // number of green pegs
    let g = [].concat(this.word); // copy the guess made
    let s = [].concat(this.secretWord); // copy the secret word
    // check for correct/green letters first
    for (let i = 0; i < s.length; i++) {
      if (g[i] == s[i]) {
        green++;
        // reset letter index to avoid double counting
        g[i] = "0";
        s[i] = "1";
      }
    }
    // check fro misplaced/yellow letters second
    for (let i = 0; i < s.length; i++) {
      if (g.indexOf(s[i]) != -1) {
        yellow++;
        // reset letter index to avoid double counting
        g[g.indexOf(s[i])] = "0";
        s[i] = "1";
      }
    }
    // win if all are correct
    if (green == 5) {
      this.win = true;
    }
    // return as list of [white, yellow, green] for printing
    return [5 - yellow - green, yellow, green];
  }

  // make a guess if the word is valid, otherwise alert that the word is invalid
  guessMade(allWords) {
    // build word to string
    let string = this.word.join("");
    // is it the full word and is it in the word list
    if (this.word.length == 5 && allWords.indexOf(string) != -1) {
      // make the guess
      this.guessed = true;
      this.updateAll();
    } else if (this.word.length == 5) {
      // popup for invalid word
      let invalid = createButton("Not in the word list.");
      invalid.position(120, 50);
      invalid.style("font-size", "20");
      invalid.size(150, 25);
      invalid.mousePressed(() => invalid.remove());
      // set parent for relative position and scaling
      invalid.parent("sketch");
      sleep(2500).then(() => invalid.remove());
    }
    // return true if the guess was made
    return this.guessed;
  }

  // update all tiles in word
  updateAll() {
    // for each letter
    for (let i = 0; i < this.word.length; i++) {
      // convert letter to index in alphabet
      let letter = this.word[i];
      let index = alphabet.indexOf(letter);
      // update the tile to display the letter
      let tile = this.tiles[i];
      tile.update(index);
      // change color of keyboard to indicate letter has been used
    }
    // update the pegs
    let pegCounts = this.getPegs();
    this.pegs = new Pegs(pegCounts[1], pegCounts[2], this.guessed);
  }

  // draw the tiles and pegs
  draw() {
    for (let i = 0; i < 5; i++) {
      this.tiles[i].draw();
    }
    this.pegs.draw(this.index, this.tileSize);
  }

  // convert guess object to json
  toJSON() {
    let colors = [];
    for (let i = 0; i < 5; i++) {
      colors.push(this.tiles[i].getColor());
    }
    let json = {
      word: this.word,
      index: this.index,
      tileSize: this.tileSize,
      guessed: this.guessed,
      secretWord: this.secretWord,
      win: this.win,
      colors: colors,
    };
    return json;
  }

  // create guess object from json
  static fromJSON(json) {
    let secretWord = json.secretWord.join("");
    let wg = new WordGuess(secretWord, json.index, json.tileSize, json.word);
    wg.guessed = json.guessed;
    wg.win = json.win;
    for (let i = 0; i < 5; i++) {
      wg.tiles[i].setColor(json.colors[i]);
    }
    return wg;
  }
}
