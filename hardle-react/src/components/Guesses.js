import { useState } from "react";
import { white, colors } from "../App.js";

import Trash from "../images/trash.png";

// component for all guesses
// props: array with guesses in the game
export default function Guesses(props) {
  const { guesses, colorsState, setColorsState } = props;
  guesses[0].setWord("SLEEP");

  return (
    <div className="guesses">
      {guesses.map((guess, index) => {
        var word = guess.word;
        word = [...word, ...Array(5 - word.length).fill("")];
        return (
          <Guess
            word={word}
            pegs={guess.pegs}
            colorsState={colorsState}
            setColorsState={setColorsState}
            key={index}
          />
        );
      })}
    </div>
  );
}

// component for a single guess: reset button, tiles, and pegs
// props: array with charaters in the guess, pegs for the guess's colors
function Guess(props) {
  const { word, pegs, colorsState, setColorsState } = props;

  return (
    <div className="guess">
      <img className="guess--reset" src={Trash} alt="reset" />
      <div className="guess--tiles">
        {word.map((letter, index) => (
          <Tile
            key={index}
            letter={letter}
            tileColors={colorsState}
            setTileColors={setColorsState}
          />
        ))}
      </div>
      <div style={{ width: "70px" }}>
        <Pegs colors={pegs.colors} />
      </div>
    </div>
  );
}

// component for a single letter tile
// props: letter on the tile
function Tile(props) {
  const { letter, tileColors, setTileColors } = props;

  // update color index
  function nextColor() {
    setSingleTileColor((prevColor) => {
      var newColor = (prevColor + 1) % 4;

      if (newColor > tileColors[letter]) {
        setTileColors((prevTileColors) => {
          return { ...prevTileColors, [letter]: newColor };
        });
      }

      return newColor;
    });
  }

  const [singleTileColor, setSingleTileColor] = useState(tileColors[letter]);

  return (
    <button
      className="tile"
      onClick={nextColor}
      style={{ backgroundColor: letter ? colors[singleTileColor] : white }}
    >
      {letter}
    </button>
  );
}

// component for set of pegs
function Pegs(props) {
  var { colors } = props;

  if (colors.length === 0) {
    colors = [...Array(5).fill(white)];
  }

  return (
    <div className="pegs">
      {colors.map((color, index) => (
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
        background: color ? color : white,
        transform: `translate(25px) rotate(${degrees}deg) translate(20px)`,
      }}
    ></div>
  );
}
