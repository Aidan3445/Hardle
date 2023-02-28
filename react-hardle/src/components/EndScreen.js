import { lightgray, green } from "../App";

export default function EndScreen(props) {
  const { store } = props;

  function guessesText() {
    if (store.guessCount === 0) {
      return "was"
    }
    if (store.guessCount === 1) {
      return "in 1 guess:"
    }
    return `in ${store.guessCount} guesses:`
  }

  return (
    <div className="endscreen" onClick={() => store.toggleStats()}>
      <h1 className="hardle">
        {`HARDLE ${guessesText()}`} <br />
        {store.secretWord}
      </h1>
      <Stats guessCount={store.guessCount} stats={store.stats} />
      <div className="share-countdown">
        <h3>NEXT HARDLE</h3>
        <div style={{ height: "100%", borderStyle: "solid" }}></div>
        <button className="share">SHARE</button>
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
        <h1>Played {totalPlayed}</h1>
        <h1>
          {"Win % "}
          {Math.round(((totalPlayed - stats[0]) / totalPlayed) * 100)}
        </h1>
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
