import WordGuess from "./WordGuess.js";
import HardleWords from "../data/HardleWords.js";

// Hardle Game class that keeps track of the current day's game
export default class Hardle {
  constructor() {
    // index of the current secret word
    this.secretWord =
      HardleWords.secretWords[
        Math.floor((new Date() - new Date(2022, 4, 7)) / 60 / 60 / 24 / 1000)
      ];
    // word lists
    this.words = HardleWords;
    // guessed words
    this.guesses = [...Array(9)].map((x) => new WordGuess());

    // guesses[guessCount] is the current word
    this.guessCount = 0;
    // is the game over
    this.gameOver = false;

    console.log(this.secretWord);
  }

  // events when physical or virtual key pressed
  // returns this Hardle object
  keyPressed(key) {
    var current = this.guesses[this.guessCount];

    switch (key) {
      case "delete":
        current.deleteLetter();
        break;
      case "enter":
        if (current.tryGuess(this.words.allWords)) {
          // valid guess was made
          this.guessCount++;
          current.setPegs(this.secretWord);
          // check for game over
          if (
            current.toString() === this.secretWord ||
            this.guessCount === this.totalGuesses
          ) {
            this.gameOver = true;
          }
        }
        break;
      default:
        current.addLetter(key);
    }
    return this;
  }

  // update tile color of a letter in a guess
  // returns this Hardle object
  nextColor(wordIndex, letterIndex) {
    this.guesses[wordIndex].tileColors[letterIndex] += 1;
    this.guesses[wordIndex].tileColors[letterIndex] %= 4;
    return this;
  }

  // get the tile color of a letter in a guess
  // returns the color index 0-3
  getColorFromIndex(wordIndex, letterIndex) {
    return this.guesses[wordIndex].tileColors[letterIndex];
  }

  // get the highest color index of a letter
  // returns the color index 0-3
  getColorFromLetter(letter) {
    var maxColor = 0;
    this.guesses.forEach((guess) =>
      guess.word.forEach((l, index) => {
        var color = guess.tileColors[index];
        if (letter === l && color > maxColor) {
          maxColor = color;
        }
      })
    );
    return maxColor;
  }
}
