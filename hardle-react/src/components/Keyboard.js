import { useEffect, useState } from "react";
import { colors } from "../App.js";

const qwerty = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]; // top row
const asdf = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]; // middle row
const zxcv = ["Z", "X", "C", "V", "B", "N", "M"]; // bottom row

export default function Keyboard(props) {
  const { game, tileColors } = props;

  const [currentGuess, setCurrentGuess] = useState(
    game.guesses[game.guessCount]
  );

  function Line(props) {
    const { letters } = props;

    function Key(props) {
      const { letter } = props;

      function keyClicked(letter) {
        setCurrentGuess((prevCurrentGuess) =>
          prevCurrentGuess.addLetter(letter)
        );
      }

      return (
        <button
          className="keyboard--key"
          onClick={() => keyClicked(letter)}
          style={{ backgroundColor: colors[tileColors[letter]] }}
        >
          {letter}
        </button>
      );
    }

    return (
      <div className="keyboard--line">
        {letters.map((letter) => (
          <Key letter={letter} key={letter} />
        ))}
      </div>
    );
  }

  return (
    <div className="keyboard">
      <Line letters={qwerty} />
      <Line letters={asdf} />
      <Line letters={zxcv} />
    </div>
  );
}
