import HardleWords from "../data/HardleWords.json";
import { darkgray, yellow, green, white } from "../App.js";

var store = {
  // the current secret word
  secretWord: "",
  // guessed words
  guesses: [],
  // colors of the tiles for each word
  tileColors: [],
  // guesses[guessCount] is the current word
  guessCount: 0,
  // show stats page after game
  showStats: false,

  // setup the game
  init() {
    var savedState = JSON.parse(this.load());
    var todaysWord = HardleWords.secretWords[this.day];
    if (savedState && savedState.secretWord === todaysWord) {
      this.secretWord = savedState.secretWord;
      this.guesses = savedState.guesses;
      this.tileColors = savedState.tileColors;
      this.guessCount = savedState.guessCount;
    } else {
      this.secretWord = todaysWord;
      this.guesses = [...Array(9).fill("")];
      this.tileColors = [...Array(9).fill([])];
      this.guessCount = 0;
    }
    this.showStats = this.won || this.lost;
  },

  // get day of Hardle
  // returns index of secretWords list
  get day() {
    return Math.floor(
      (new Date() - new Date(2022, 4, 7)) / 60 / 60 / 24 / 1000
    );
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
  // returns false if the guess is invalid
  keyPressed(key) {
    if (this.won || this.lost) {
      return true;
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
        if (currentWord.length === 5) {
          if (HardleWords.allWords.includes(currentWord)) {
            this.guessCount += 1;
            this.onWinLoss();
          } else {
            // 5 letters typed but word is invalid
            return false;
          }
        }
        break;
      default:
        if (currentWord.length < 5 && key.match(/^[a-zA-Z]$/)) {
          this.guesses[this.guessCount] = currentWord + key.toUpperCase();
          this.tileColors[this.guessCount].push(0);
        }
    }
    return true;
  },

  // update the color of a tile when clicked, update keyboard when necessary
  tileClicked(wordIndex, letterIndex) {
    if (this.guesses[wordIndex].length <= letterIndex) {
      return;
    }
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

  // get pegs for a guess
  // return color array
  getPegs(wordIndex) {
    if (wordIndex >= this.guessCount) {
      return Array(5).fill(white);
    }
    let y = 0; // number of yellow pegs
    let g = 0; // number of green pegs
    let word = [...this.guesses[wordIndex]]; // copy the guess made to an array
    let target = [...this.secretWord]; // copy the secret word to an array

    // check for correct/green letters first
    target.map((letter, index) => {
      if (letter === word[index]) {
        g++;
        // set letter at index to avoid double counting
        word[index] = "0";
        return "1";
      }
      return letter;
    });

    // check fro misplaced/yellow letters second
    target.map((letter) => {
      if (word.indexOf(letter) !== -1) {
        y++;
        // reset letter index to avoid double counting
        word[word.indexOf(letter)] = 0;
        return 1;
      }
      return letter;
    });

    // fill pegColors array
    var pegColors = [
      ...Array(y).fill(yellow),
      ...Array(g).fill(green),
      ...Array(5 - y - g).fill(darkgray),
    ];
    return pegColors;
  },

  // toggle show stats
  toggleStats() {
    if (this.won || this.lost) {
      this.showStats = !this.showStats;
    }
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

  // get stats
  // returns stats array
  get stats() {
    var stats = localStorage.getItem("25bkUH9cO0P");

    if (stats) {
      var statsArray = stats.split(",").map((x) => parseInt(x));
      return statsArray;
    }

    return this.newStats;
  },

  // create, save, and return a new stats array
  get newStats() {
    var statsArray = [...Array(10).fill(0)];
    localStorage.setItem("25bkUH9cO0P", statsArray);
    return statsArray;
  },

  // run once on win/loss to update stats
  onWinLoss() {
    if (this.won || this.lost) {
      var statsString = localStorage.getItem("25bkUH9cO0P");
      let currentStats;
      if (statsString) {
        currentStats = JSON.parse(currentStats);
      } else {
        currentStats = this.newStats;
      }
      if (this.won) {
        currentStats[this.guessCount] += 1;
      } else if (this.lost) {
        currentStats[0] += 1;
        this.guessCount = 0;
      }
      localStorage.setItem("25bkUH9cO0P", currentStats);
      this.showStats = true;
    }
  },
};

export default store;
