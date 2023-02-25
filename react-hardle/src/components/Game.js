import { useState } from "react";

import Guesses from "./Guesses.js";
import Keyboard from "./Keyboard.js";

export default function Game(props) {
    const {hardle} = props;

    const [game, updateGame] = useState(hardle);

  return (
    <main>
      <Guesses game={game} updateGame={updateGame} />
      <Keyboard game={hardle} updateGame={updateGame} />
    </main>
  );
}
