import { observer } from "mobx-react-lite";
import { white, colors } from "../App.js";

import Trash from "../images/trash.png";

// component for a single guess: reset button, tiles, and pegs
// props: array with charaters in the guess, pegs for the guess's colors
export default observer(function Guess(props) {
  const { store, guess, tileColors, isGuessed, wordIndex } = props;

  function tileClicked(e, letterIndex) {
    e.target.blur();
    store.tileClicked(wordIndex, letterIndex);
  }

  function resetTiles() {
    if (isGuessed) {
      store.resetWordColors(wordIndex);
    }
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
              handleClick={(e) => tileClicked(e, index)}
              key={index}
            />
          ))}
      </div>
      <Pegs pegColors={store.getPegs(wordIndex)} />
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
      tabIndex={-1}
    >
      {letter}
    </button>
  );
}

// component for set of pegs
function Pegs(props) {
  var { pegColors } = props;

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
        transform: `translate(calc(var(--vw, 1vw) * 4), calc(var(--vh, 1vh) * 2.5)) rotate(${degrees}deg) translate(2vh)`,
      }}
    ></div>
  );
}
