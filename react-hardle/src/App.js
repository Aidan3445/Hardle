import { useEffect, useState } from "react";
import { observer, useLocalObservable } from "mobx-react-lite";
import "./App.css";

import Hardle from "./store/Hardle.js";

import Navbar from "./components/Navbar.js";
import Guess from "./components/Guess.js";
import Keyboard from "./components/Keyboard.js";
import EndScreen from "./components/EndScreen.js";

// main app component
export default observer(function App() {
  const store = useLocalObservable(() => Hardle);

  // popup handler
  const [popup, setPopup] = useState({ show: false, text: "" });

  function newPopup(popupText) {
    if (!popup.show) {
      setPopup(() => ({ show: true, text: popupText }));
      setTimeout(() => setPopup(() => ({ show: false, text: "" })), 2000);
    }
  }

  useEffect(() => {
    store.init();

    function handleKeyup(e) {
      if (!store.keyPressed(e.key)) {
        newPopup("Invalid word.");
      }
    }

    window.addEventListener("keyup", handleKeyup);
    return () => window.removeEventListener("keyup", handleKeyup);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // save before reload and tab close
  window.onbeforeunload = function () {
    return store.save();
  };

  return (
    <div>
      <Navbar store={store} />
      <main>
        {store.guesses.map((guess, index) => (
          <Guess
            store={store}
            guess={guess}
            tileColors={store.tileColors[index]}
            isGuessed={store.guessCount > index}
            wordIndex={index}
            key={index}
          />
        ))}
        <Keyboard store={store} newPopup={newPopup} />
      </main>
      {store.showStats && <EndScreen store={store} newPopup={newPopup} />}
      {popup.show && <button className="popup">{popup.text}</button>}
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
