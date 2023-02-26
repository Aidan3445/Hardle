import { observer } from "mobx-react-lite";
import { colors } from "../App.js";

const qwerty = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

// Keyboard component
export default observer(function Keyboard(props) {
  const { store } = props;

  // Keyboard component result
  return (
    <div className="keyboard">
      {qwerty.map((line, lineNumber) => (
        <div className="keyboard--line" key={lineNumber}>
          {lineNumber === 2 && (
            <button
              className="keyboard--key wide-key"
              onClick={() => store.keyPressed("Enter")}
            >
              {"\u21B5"}
            </button>
          )}
          {line.split("").map((key) => (
            <button
              className="keyboard--key"
              onClick={() => store.keyPressed(key)}
              style={{ backgroundColor: colors[store.getKeyColor(key)] }}
              key={key}
            >
              {key.toUpperCase()}
            </button>
          ))}
          {lineNumber === 2 && (
            <button
              className="keyboard--key wide-key"
              onClick={() => store.keyPressed("Backspace")}
            >
              {"\u232B"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
});
