import HardleWords from "../data/HardleWords.json";

export default {
  // the current secret word
  secretWord: "",
  // guessed words
  guesses: [],
  // colors of the tiles for each word
  tileColors: [],
  // guesses[guessCount] is the current word
  guessCount: 0,

  // setup the game
  init() {
    var savedState = JSON.parse(this.load());
    if (savedState) {
      this.secretWord = savedState.secretWord;
    this.guesses = savedState.guesses;
    this.tileColors = savedState.tileColors;
    this.guessCount = savedState.guessCount;
    } else {
      this.secretWord =
        HardleWords.secretWords[
          Math.floor((new Date() - new Date(2022, 4, 7)) / 60 / 60 / 24 / 1000)
        ];
      this.guesses = [...Array(9).fill("")];
      this.tileColors = [...Array(9).fill([])];
      this.guessCount = 0;
    }
  },

  // was the game won
  // returns bool
  get won() {
    return (
      this.guessCount !== 0 &&
      this.guesses[this.guessCount - 1] === this.secretWord
    );
  },

  // was the game lost
  // returns bool
  get lost() {
    return this.guessCount === 9;
  },

  // events when physical or virtual key pressed
  keyPressed(key) {
    if (this.won || this.lost) {
      return;
    }
    var currentWord = this.guesses[this.guessCount];
    var currentColors = this.tileColors[this.guessCount];
    switch (key) {
      case "Backspace":
        this.guesses[this.guessCount] = currentWord.slice(
          0,
          currentWord.length - 1
        );
        this.tileColors[this.guessCount] = currentColors.slice(
          0,
          currentColors.length - 1
        );
        break;
      case "Enter":
        if (
          currentWord.length === 5 &&
          HardleWords.allWords.includes(currentWord)
        ) {
          this.guessCount += 1;
        }
        break;
      default:
        if (currentWord.length < 5 && key.match(/^[a-zA-Z]$/)) {
          this.guesses[this.guessCount] = currentWord + key.toUpperCase();
          this.tileColors[this.guessCount].push(0);
        }
    }
  },

  // update the color of a tile when clicked, update keyboard when necessary
  tileClicked(wordIndex, letterIndex) {
    var prevColor = this.tileColors[wordIndex][letterIndex];
    this.tileColors[wordIndex][letterIndex] = (prevColor + 1) % 4;
  },

  // reset the tile colors for a word
  resetWordColors(wordIndex) {
    this.tileColors[wordIndex].fill(0);
  },

  // does a word have any colored tiles
  // returns bool‰
  isWordColored(wordIndex) {
    return this.tileColors[wordIndex].reduce(
      (acc, val) => acc || val !== 0,
      false
    );
  },

  // get the color to set a key
  // returns color index 0-3
  getKeyColor(letter) {
    var maxColor = 0;
    this.guesses.forEach((word, wordIndex) => {
      var letterIndex = word.indexOf(letter.toUpperCase());
      if (letterIndex >= 0) {
        maxColor = Math.max(maxColor, this.tileColors[wordIndex][letterIndex]);
      }
    });
    return maxColor;
  },

  // save game state to localStorage
  save() {
    var gameState = {
      secretWord: this.secretWord, // add encryption
      guesses: [...this.guesses],
      tileColors: [...[...this.tileColors]],
      guessCount: this.guessCount,
    };
    localStorage.setItem("7lEU8htFNd", JSON.stringify(gameState));
  },

  // load game state from localStorage
  load() {
    return localStorage.getItem("7lEU8htFNd");
  },
};
