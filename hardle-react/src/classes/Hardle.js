import WordGuess from "./WordGuess.js";

// Hardle Game class that keeps track of the current day's game
export default class Hardle {
  constructor() {
    // index of the current secret word
    this.secretWord = Math.floor(
      (new Date() - new Date(2022, 4, 7)) / 60 / 60 / 24 / 1000
    );
    // word lists
    this.words = null;
    // guessed words
    this.guesses = [...Array(9).fill(new WordGuess())];
    // guesses[guessCount] is the current word
    this.guessCount = 0;
    // is the game over
    this.gameOver = false;
  }

  // events when physical or virtual key pressed
  keyPressed(key) {
    var current = this.guesses[this.guessCount];

    switch (key) {
      case "delete":
        current.deleteLetter();
        break;
      case "enter":
        if (current.tryGuess(this.words.allWords)) {
          // valid guess was made, increase word count
          this.guessCount++;
          // check for game over
          if (current.checkWin(this.secretWord) || this.guessCount === this.totalGuesses) {
            this.gameOver = true;
          }
        }
        break;
      default:
        current.addLetter(key.toUpperCase());    
    }
  }
}
