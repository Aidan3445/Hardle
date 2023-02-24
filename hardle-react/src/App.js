import { useState } from "react";
import "./App.css";

import Navbar from "./components/Navbar.js";
import Guesses from "./components/Guesses.js";
import Keyboard from "./components/Keyboard.js";
import Stats from "./components/Stats.js";

// main app component
export default function App(props) {
  const { hardle } = props;

  const [gameOver, setGameOver] = useState(hardle.gameOver);

  var defaultColors = {};
  alphabet.map((letter) => (letter ? (defaultColors[letter] = 0) : null));
  const [colorsState, setColorsState] = useState(defaultColors);

  return (
    <div className="app">
      {gameOver ? (
        <Stats />
      ) : (
        <div>
          <Navbar />
          <Guesses
            guesses={hardle.guesses}
            colorsState={colorsState}
            setColorsState={setColorsState}
          />
          <Keyboard game={hardle} tileColors={colorsState} />
        </div>
      )}
    </div>
  );
}

// color scheme
var lightgray = "rgb(185, 185, 185)";
var darkgray = "rgb(125, 125, 125)";
var yellow = "rgb(255, 224, 71)";
var green = "rgb(120, 215, 70)";
var white = "rgb(255, 255, 255)";
var colors = [lightgray, darkgray, yellow, green];

let alphabet = [
  // global list of letters and "" to represent blank
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "",
];

export { lightgray, darkgray, yellow, green, white, colors, alphabet };
