import { useState } from "react";
import Trash from "../images/trash.png";

export default function Guesses() {
  return (
    <div className="guesses">
      <Guess />
      <Guess />
      <Guess />
      <Guess />
      <Guess />
      <Guess />
      <Guess />
      <Guess />
      <Guess />
    </div>
  );
}

function Guess() {
  return (
    <div className="guess">
      <img className="guess--reset" src={Trash} alt="reset"/>
      <div className="guess--tiles">
        <Tile />
        <Tile />
        <Tile />
        <Tile />
        <Tile />
      </div>
    </div>
  );
}

var lightgray = "rgb(185, 185, 185)";
var darkgray = "rgb(125, 125, 125)";
var yellow = "rgb(255, 224, 71)";
var green = "rgb(120, 215, 70)";
var colors = [lightgray, darkgray, yellow, green];


function Tile() {
  const [tileColor, setTileColor] = useState(0);
  const [tileLetter, setTileLetter] = useState("");

  function nextColor() {
    setTileColor((prevTileColor) => (prevTileColor + 1) % 4);
  }

  return <button className="tile" onClick={nextColor} style={{backgroundColor: colors[tileColor]}}>{tileLetter}</button>;
}