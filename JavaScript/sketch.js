let game; // game object
let words; // words object
let letters = []; // list of all letter images
let stats; // stats object
let day; // Hardle day number

let cnv; // Canvas for local button placement

let alphabet = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "_",
];

function preload() {
  words = new WordleWords();
  for (let i = 0; i < 27; i++) {
    for (let sufx of ["l", "d", "y", "g"]) {
      letters[i] = loadImage(
        "images/tiles/" + alphabet[i] + "_" + sufx + ".png"
      );
    }
  }
}

function setup() {
  cnv = createCanvas(400, 530);
  cnv.parent("sketch");
  let sketch = document.getElementById("sketch");
  let scale = (document.documentElement.scrollHeight / 530) * 0.9;
  sketch.style.zoom = scale;
  day = floor((new Date() - new Date(2022, 4, 7)) / 60 / 60 / 24 / 1000); // get current hardle day
  stats = getItem("stats"); // load stats item from local browser storage
  if (stats == null) {
    // if no stats object is found make a new one
    stats = {
      s: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      p: -1,
    };
  }
  let stored = getItem("Hardle" + day); // load hardle from today
  game = new Hardle(words);
  if (stored != null) {
    // if a game was started load that into the new game
    game.guessCount = stored.guessCount;
    game.secretWordIndex = stored.secretWordIndex;
    game.wordLength = stored.wordLength;
    game.tileSize = stored.tileSize;
    game.totalGuesses = stored.totalGuesses;
    game.win = stored.win;
    game.guesses = aMap(stored.guesses, WordGuess.fromJSON);
    game.board();
  }
}

function draw() {
  background("lightgray");
  game.play();
}

function keyPressed() {
  game.keyPressed();
}

function updateStats(guesses) {
  let i = guesses % game.totalGuesses;
  if (stats.p != game.secretWordIndex) {
    stats.s[i]++;
    stats.p = game.secretWordIndex;
  }
  storeItem("stats", stats);
}

function aMap(array, func) {
  newArr = [];
  for (let element of array) {
    newArr.push(func(element));
  }
  return newArr;
}

function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  });
}
