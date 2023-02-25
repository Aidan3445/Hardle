import { colors } from "../App.js";

const qwerty = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

// Keyboard component
export default function Keyboard(props) {
  const { game, updateGame } = props;

  // pass key input to hardle game
  function gameInput(input) {
    updateGame((prevGame) => {
      return prevGame.keyPressed(input);
    });
  }

  // Keyboard component result
  return (
    <div className="keyboard">
      {qwerty.map((line, lineNumber) => (
        <div className="keyboard--line" key={lineNumber}>
          {lineNumber === 2 && (
            <button
              className="keyboard--key wide-key"
              // onClick={deleteLetter}
            >
              {"\u232B"}
            </button>
          )}
          {line.split("").map((key) => (
            <button
              className="keyboard--key"
              // onClick={keyClicked}
              // style={{ backgroundColor: getColor() }}
              key={key}
            >
              {key.toUpperCase()}
            </button>
          ))}
          {lineNumber === 2 && (
            <button className="keyboard--key wide-key" /*onClick={tryGuess}*/>
              {"\u21B5"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
