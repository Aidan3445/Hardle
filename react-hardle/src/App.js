import { useEffect } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import "./App.css";

import puzzleStore from "./store/puzzleStore.js";

import Navbar from "./components/Navbar.js";
import Guess from "./components/Guess.js";
import Keyboard from "./components/Keyboard.js";
import EndScreen from "./components/EndScreen.js";

// main app component
export default observer(function App() {
  const store = useLocalObservable(() => puzzleStore);

  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);
    store.init();

    return () => window.removeEventListener("keyup", handleKeyup);
  }, []);

  function handleKeyup(e) {
    store.keyPressed(e.key);
  }

  window.onbeforeunload = function () {
    return store.save();
  };

  return (
    <div>
      <Navbar store={store} />
      {store.guesses.map((guess, index) => (
        <Guess
          store={store}
          secretWord={store.secretWord}
          guess={guess}
          tileColors={store.tileColors[index]}
          isGuessed={store.guessCount > index}
          wordIndex={index}
          key={index}
        />
      ))}
      <Keyboard store={store} />
      {store.showStats && <EndScreen store={store} />}
    </div>
  );
});

// color scheme
var lightgray = "rgb(185, 185, 185)";
var darkgray = "rgb(125, 125, 125)";
var yellow = "rgb(255, 224, 71)";
var green = "rgb(120, 215, 70)";
var white = "rgb(255, 255, 255)";
var colors = [lightgray, darkgray, yellow, green];

export { lightgray, darkgray, yellow, green, white, colors };
