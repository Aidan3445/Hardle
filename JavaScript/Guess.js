// class for guesses
class WordGuess {
  constructor(wordleWord, index, tileSize, word=[]) {
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
    for (let i = 0; i < 5; i++) {
      let x =
        width / 2 - this.tileSize * 3.5 + i * this.tileSize * 1.1 + width / 25;
      let y = (this.index * this.tileSize * 11) / 10 + this.tileSize / 3;
      this.tiles.push(new Letter(x, y, this.tileSize));
    }
    this.updateAll();
  }

  // add a letter to the guess
  addLetter(letter) {
    let index = alphabet.indexOf(letter);
    if (this.word.length < this.secretWord.length && index != -1) {
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
    tile.resetColor();
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
    return [5 - yellow - green, yellow, green];
  }

  // make a guess if the word is valid, otherwise alert that the word is invalid
  guessMade(wordLength, allWords) {
    let string = "";
    for (let s of this.word) {
      string += s;
    }
    if (this.word.length == wordLength && allWords.indexOf(string) != -1) {
      this.enable();
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

  // update all tiles in word
  updateAll() {
    for (let i = 0; i < this.word.length; i++) {
      let letter = this.word[i];
      let index = alphabet.indexOf(letter);
      let tile = this.tiles[i];
      tile.update(index);
    }
  }

  // enable clicking to change colors
  enable() {
    if (this.guessed) {
      this.getPegs();
    }
    for (let i = 0; i < this.word.length; i++) {
      this.tiles[i].enable();
    }
  }

  // convert guess object to json
  static toJSON(obj) {
    let json = {
      word: obj.word,
      index: obj.index,
      tileSize: obj.tileSize,
      guessed: obj.guessed,
      secretWord: obj.secretWord,
      win: obj.win,
    };
    return json;
  }

  // create guess object from json
  static fromJSON(json) {
    let secretWord = json.secretWord.join("");
    let wg = new WordGuess(secretWord, json.index, json.tileSize, json.word);
    wg.guessed = json.guessed;
    wg.win = json.win;
    wg.enable();
    return wg;
  }
}
