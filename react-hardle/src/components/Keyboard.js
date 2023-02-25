import { colors } from "../App.js";

const qwerty = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"]; // top row
const asdf = ["A", "S", "D", "F", "G", "H", "J", "K", "L"]; // middle row
const zxcv = ["Z", "X", "C", "V", "B", "N", "M"]; // bottom row

// Keyboard component
export default function Keyboard(props) {
  const { game, updateGame } = props;

  // pass key input to hardle game
  function gameInput(input) {
    updateGame((prevGame) => {
      return prevGame.keyPressed(input);
    });
  }

  // Line component
  function Line(props) {
    const { letters } = props;

    // Key component
    function Key(props) {
      const { letter } = props;

      // key handler
      function keyClicked() {
        gameInput(letter);
      }

      // real keyboard handler
      function keyDown(event) {
        if (event.key === letter) {
          keyClicked();
        }
      }

      function getColor() {
        return colors[game.getColorFromLetter(letter)];
      }

      // Key component result
      return (
        <button
          className="keyboard--key"
          type="button"
          onClick={keyClicked}
          onKeyDown={keyDown}
          style={{ backgroundColor: getColor() }}
        >
          {letter}
        </button>
      );
    }

    // Line component result
    return (
      <form className="keyboard--line">
        {letters.map((letter) => (
          <Key letter={letter} key={letter} />
        ))}
      </form>
    );
  }

  function Enter() {
    function tryGuess() {
      gameInput("enter");
    }

    return (
      <button
        className="keyboard--key wide-key"
        onClick={tryGuess}
      >
        {"\u21B5"}
      </button>
    );
  }

  function Delete() {
    function deleteLetter() {
      gameInput("delete");
    }

    return (
      <button
        className="keyboard--key wide-key"
        onClick={deleteLetter}
      >
        {"\u232B"}
      </button>
    );
  }

  // Keyboard component result
  return (
    <div className="keyboard">
      <Line letters={qwerty} />
      <Line letters={asdf} />
      <div className="keyboard--line" style={{ marginTop: 0 }}>
        <Enter />
        <Line letters={zxcv} />
        <Delete />
      </div>
    </div>
  );
}
