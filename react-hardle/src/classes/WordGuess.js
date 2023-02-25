import { alphabet } from "../App.js";
import HardleWords from "../data/HardleWords.js";
import PegData from "./PegData.js";

var { allWords } = HardleWords;

// class for a single guess in the game
export default class WordGuess {
  constructor() {
    // array with charaters in the guess
    this.word = [];
    // array for the colors of each tile in the guess
    this.tileColors = [];
    // pegs for the guess's colors
    this.pegs = new PegData();
  }

  // reduce list of letters to single string
  // returns string
  toString() {
    return this.word.reduce((acc, curr) => acc + curr, "");
  }

  // add a letter to the guess
  // returns this WordGuess object
  addLetter(letter) {
    let index = alphabet.indexOf(letter);
    if (this.word.length < 5 && index !== -1) {
      this.word.push(letter);
      this.tileColors.push(0);
    }
    return this;
  }

  // delete last letter from the guess
  // returns this WordGuess object
  deleteLetter() {
    this.word.pop();
    this.tileColors.pop();
    return this;
  }

  // set the full word
  // returns this WordGuess object
  setWord(word) {
    this.word = [...word];
    return this;
  }

  // is this guess a valid 5 letter word
  // returns bool
  tryGuess() {
    return this.word.length === 5 && allWords.indexOf(this.toString()) > -1;
  }

  // fill the pegs based closeness to the secret word
  setPegs(secretWord) {
    let yellow = 0; // number of yellow pegs
    let green = 0; // number of green pegs
    let guess = this.word.slice(); // copy the guess made
    let s = [...secretWord] // copy the secret word to an array

    // check for correct/green letters first
    s.map((letter, index) => {
      if (letter === guess[index]) {
        green++;
        // set letter at index to avoid double counting
        guess[index] = "0";
        return "1"
      }
      return letter;
    });

    // check fro misplaced/yellow letters second
    s.map((letter) => {
      if (guess.indexOf(letter) !== -1) {
        yellow++;
        // reset letter index to avoid double counting
        guess[guess.indexOf(letter)] = 0;
        return 1;
      }
      return letter
    });

    // set the pegs
    this.pegs.setPegs(yellow, green);
  }
}
