import { useEffect, useState } from "react";
import { lightgray, green } from "../App";

export default function EndScreen(props) {
  const { store } = props;

  function guessesText() {
    if (store.guessCount === 0) {
      return "was";
    }
    if (store.guessCount === 1) {
      return "in 1 guess:";
    }
    return `in ${store.guessCount} guesses:`;
  }

  return (
    <div className="endscreen" onClick={() => store.toggleStats()}>
      <h1 className="hardle endscreen--title">
        {`HARDLE ${guessesText()}`} <br />
        {store.secretWord}
      </h1>
      <Definition secretWord={store.secretWord} />
      <Stats guessCount={store.guessCount} stats={store.stats} />
      <div className="share-countdown">
        <h2>
          NEXT HARDLE <Timer />
        </h2>
        <Share store={store} />
      </div>
    </div>
  );
}

function Stats(props) {
  const { guessCount, stats } = props;

  var totalPlayed = stats.reduce((acc, val) => acc + val, 0);
  var maxStat = stats.reduce((acc, val) => Math.max(acc, val), 0);

  return (
    <div className="stats">
      <div className="stats--totals">
        <h2>Played {totalPlayed}</h2>
        <h2>
          {"Win % "}
          {Math.round(((totalPlayed - stats[0]) / totalPlayed) * 100)}
        </h2>
      </div>
      <div className="stats--chart">
        <p className="stats--title">Guesses</p>
        {stats.slice(1).map((count, index) => (
          <div key={index} className="chart--line">
            <div className="chart--number">{index + 1}</div>
            <div
              className="chart--bar"
              style={{
                width: `${(90 * count) / maxStat}%`,
                background: index + 1 === guessCount ? green : lightgray,
              }}
            >
              <div className="chart--number">{count}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Definition(props) {
  const { secretWord } = props;

  const [definition, setDefinition] = useState("");

  useEffect(() => {
    getDefinition(secretWord);
  }, []);

  // get definition from https://dictionaryapi.dev/ API
  function getDefinition(word) {
    return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then((response) => response.json())
      .then((data) => {
        // get first definition from JSON
        let definition = data[0].meanings[0].definitions[0].definition;
        if (definition) {
          let partOfSpeech = data[0].meanings[0].partOfSpeech;
          let definitionText = `Definition: ${partOfSpeech} - ${definition}`;
          setDefinition(definitionText);
        }
      });
  }

  return <div className="endscreen--def">{definition}</div>;
}

function Timer() {
  const [timer, setTimer] = useState(getTimer());

  setTimeout(() => setTimer(() => getTimer()), 1000);

  // get time until next hardle at midnight local time
  function getTimer() {
    var date = new Date();
    let time = `${addZero(23 - date.getHours())}:${addZero(
      59 - date.getMinutes()
    )}:${addZero(59 - date.getSeconds())}`;
    return time;
  }

  // helper function for formatting the timer to 00:00:00 format
  function addZero(time) {
    if (String(time).length == 1) {
      time = "0" + time;
    }
    return time;
  }

  return <div>{timer}</div>;
}

function Share(props) {
  const { store } = props;

  // create message for sharing scores
  function getShareText() {
    // start with the score
    let copyPaste = this.score();
    // list of emojis for the guess pegs
    let emoji = ["⚪", "🟡", "🟢"];
    // for each guess, get the pegs and convert them into strings
    for (let n = 0; n < this.guessCount; n++) {
      let guess = this.guesses[n];
      let pegCounts = guess.getPegs();
      let tempBoxes = "";
      for (let i = 0; i < 3; i++) {
        tempBoxes += emoji[i].repeat(pegCounts[i]);
      }
      // add each as a new line to the score message
      copyPaste += "\r" + tempBoxes;
    }
    copyPaste += "\rhttps://hardle.netlify.app/";
    // copy to clipboard
    window.navigator.clipboard.writeText(copyPaste).then(function (x) {
      // popup to notify copy
      // let copied = createButton("Copied to clipboard.");
      // copied.position(120, 100);
      // copied.style("font-size", "20");
      // copied.style("color", "black");
      // copied.style("background-color", "white");
      // copied.style("border-radius", "5px");
      // copied.style("border-style", "solid");
      // copied.size(150, 25);
      // copied.mousePressed(() => copied.remove());
      // // set parent for relative position and scaling
      // copied.parent("sketch");
      // sleep(5000).then(() => copied.remove());
    });
  }

  // return a string score of the game i.e "4/9"
  function score() {
    let guessOrX;
    // if the game was lost X/9 is the score
    if (store.lost) {
      guessOrX = "X";
    } else {
      // if the game was won use the number of guesses
      guessOrX = store.guessCount;
    }
    let score = `Hardle ${store.day} ${guessOrX}/9`;
    // return the string
    return score;
  }

  console.log(score());

  return <button className="share"> SHARE</button>
}
