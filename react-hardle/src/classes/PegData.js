import { yellow, green, darkgray } from "../App.js";

// class for the color pegs of a guess based on the closeness to the secret word
export default class PegData {
  constructor() {
    // pegs are created with no colors (drawn white)
    this.colors = Array(0);
  }

  // fill the peg colors array based on the guess' letter matches
  // returns this PegData object
  setPegs(yellowCount, greenCount) {
    this.colors = [
      ...Array(yellowCount).fill(yellow),
      ...Array(greenCount).fill(green),
      ...Array(5 - yellowCount - greenCount).fill(darkgray),
    ];

    return this;
  }
}
