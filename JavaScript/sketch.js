let game; // global game object
let words; // global words object
let letters = []; // global list of all letter images
let stats; // global stats object

let cnv; // Canvas for local button placement

let alphabet = [
  // global list of letters and "-" to represent blank
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

// get word lists and images
function preload() {
  words = new WordleWords();
  // load each letter in each color
  // for (let i = 0; i < 27; i++) {
  //   letters.push(loadImage("images/tiles/" + alphabet[i] + "_black.png"));
  // }
}

// setup the game
function setup() {
  // make the canvas and put in the sketch container
  cnv = createCanvas(400, 530);
  cnv.parent("sketch");
  // turn off draw loop
  noLoop();
  // scale the entire container to fill screen
  let sketch = document.getElementById("sketch");
  let scaleVert = (document.documentElement.scrollHeight / 530) * 0.95;
  let scaleHori = (document.documentElement.scrollWidth / 400) * 0.95;
  let sketchScale = Math.min(scaleVert, scaleHori);
  sketch.style.zoom = sketchScale;
  // get current day of hardle
  let day = floor((new Date() - new Date(2022, 4, 7)) / 60 / 60 / 24 / 1000);
  // load stats item from local browser storage
  stats = getItem("stats");
  if (stats == null) {
    // if no stats object is found make a new one
    stats = {
      s: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      p: -1,
    };
  }
  // load hardle from today
  let stored = getItem("Hardle");
  // if a game from today is found load it
  if (stored != null && stored.secretWordIndex == day) {
    game = Hardle.loadData(stored, words);
    game.board();
  } else {
    // otherwise make a new one
    game = new Hardle(words);
    game.board();
    game.showInfo();
  }
}

// handle keyboard inputs via p5
function keyPressed() {
  game.keyPressed(key);
}

// map helper function
function aMap(array, func) {
  newArr = [];
  for (let element of array) {
    newArr.push(func(element));
  }
  return newArr;
}

// time wait helper fuinction (in milliseconds)
function sleep(millisecondsDuration) {
  return new Promise((resolve) => {
    setTimeout(resolve, millisecondsDuration);
  });
}
