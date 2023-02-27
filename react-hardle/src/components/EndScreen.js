import { lightgray, green } from "../App";

var stats = {
  s: [2, 1, 2, 3, 4, 3, 2, 1, 7, 0],
  p: -1,
};

var thisGuessCount = 5;
var totalPlayed = stats.s.reduce((acc, val) => acc + val, 0);
var maxStat = stats.s.reduce((acc, val) => Math.max(acc, val), 0);

export default function EndScreen(props) {
  const { store } = props;
  return (
    <div className="endscreen">
      <h1 className="hardle">{`HARDLE ${thisGuessCount}/9:`}</h1>
      <Stats />
      <div className="share-countdown">
        <h3>NEXT HARDLE</h3>
        <div style={{ height: "100%", borderStyle: "solid" }}></div>
        <button className="share">SHARE</button>
      </div>
    </div>
  );
}

function Stats() {
  return (
    <div className="stats">
      <div className="stats--totals">
        <h1>Played {totalPlayed}</h1>
        <h1>
          {"Win % "}
          {Math.round(((totalPlayed - stats.s[0]) / totalPlayed) * 100)}
        </h1>
      </div>
      <div className="stats--chart">
        <p className="stats--title">Guesses</p>
        {stats.s.slice(1).map((count, index) => (
          <div key={index} className="chart--line">
            <div className="chart--number">{index + 1}</div>
            <div
              className="chart--bar"
              style={{
                width: `${(90 * count) / maxStat}%`,
                background: index + 1 === thisGuessCount ? green : lightgray,
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
