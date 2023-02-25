import { observer } from "mobx-react-lite";
import { useState } from "react";
import { darkgray, yellow, green, white, colors } from "../App.js";

import Trash from "../images/trash.png";

// component for a single guess: reset button, tiles, and pegs
// props: array with charaters in the guess, pegs for the guess's colors
export default observer(function Guess(props) {
  const { store, secretWord, guess, tileColors, isGuessed, wordIndex } = props;

  function tileClicked(letterIndex) {
    store.tileClicked(wordIndex, letterIndex);
  }

  function resetTiles() {
    store.resetWordColors(wordIndex);
  }

  return (
    <div className="guess">
      <img
        className="guess--reset"
        src={Trash}
        alt="reset"
        style={{
          opacity: isGuessed ? (store.isWordColored(wordIndex) ? 1 : 0.5) : 0,
        }}
        onClick={resetTiles}
      />
      <div className="guess--tiles">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <Tile
              letter={guess[index]}
              color={tileColors[index]}
              handleClick={() => tileClicked(index)}
              key={index}
            />
          ))}
      </div>
      <div style={{ width: "70px" }}>
        <Pegs secretWord={secretWord} guess={guess} isGuessed={isGuessed} />
      </div>
    </div>
  );
});

// component for a single letter tile
// props: letter on the tile
function Tile(props) {
  const { letter, color, handleClick } = props;

  return (
    <button
      className="tile"
      onClick={handleClick}
      style={{ backgroundColor: letter ? colors[color] : white }}
    >
      {letter}
    </button>
  );
}

// component for set of pegs
function Pegs(props) {
  var { secretWord, guess, isGuessed } = props;

  let pegColors;
  if (isGuessed) {
    let y = 0; // number of yellow pegs
    let g = 0; // number of green pegs
    let word = [...guess]; // copy the guess made to an array
    let target = [...secretWord]; // copy the secret word to an array

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
    pegColors = [
      ...Array(y).fill(yellow),
      ...Array(g).fill(green),
      ...Array(5 - y - g).fill(darkgray),
    ];
  } else {
    pegColors = Array(5).fill(white);
  }

  return (
    <div className="pegs">
      {pegColors.map((color, index) => (
        <Peg key={index} color={color} index={index} />
      ))}
    </div>
  );
}

// component for a single peg
// props: color of the peg, number peg in pentagon/circle
function Peg(props) {
  const { color, index } = props;

  var degrees = (360 * index) / 5 - 89;

  return (
    <div
      className="pegs--peg"
      style={{
        background: color,
        transform: `translate(25px) rotate(${degrees}deg) translate(20px)`,
      }}
    ></div>
  );
}
