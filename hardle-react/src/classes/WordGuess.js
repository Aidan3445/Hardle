import { alphabet } from "../App.js";
import PegData from "./PegData.js";

// class for a single guess in the game
export default class WordGuess {
  constructor() {
    // array with charaters in the guess
    this.word = [];
    // pegs for the guess's colors
    this.pegs = new PegData();
  }

  // add a letter to the guess
  // returns this WordGuess object
  addLetter(letter) {
    let index = alphabet.indexOf(letter);
    if (this.word.length < 5 && index !== -1) {
      this.word.push(letter);
    }
    return this;
  }

  // delete last letter from the guess
  // returns this WordGuess object
  deleteLetter() {
    this.word.pop();
    return this;
  }

  // set the full word
  // returns this WordGuess object
  setWord(word) {
    this.word = [...word];
    return this;
  }
}
