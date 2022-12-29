let game; // game object
let words; // words object
let letters = []; // list of all letter images
let stats; // stats object
let day; // Hardle day number

let alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
                "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
                "U", "V", "W", "X", "Y", "Z", "_"];

function preload() {
  words = new WordleWords();
  for (let i = 0; i < 27; i++) {
    letters[i] = loadImage("images/tiles/" + alphabet[i] + "_black.png")
  }
}

function setup() {
  createCanvas(400, 530);
  day = floor((new Date() - new Date(2022, 4, 7)) / 60 / 60 / 24 / 1000); // get current hardle day
  stats = getItem("stats"); // load stats item from local browser storage
  if (stats == null) { // if no stats object is found make a new one
    stats = {
      s: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      p: -1,
    };
  }
  let stored = getItem("Hardle" + day); // load hardle from today
  game = new Hardle(words);
  if (stored != null) { // if a game was started load that into the new game
    game.guessCount = stored.guessCount;
    game.guesses = aMap(stored.guesses, WordGuess.fromJSON);
    game.secretWordIndex = stored.secretWordIndex;
    game.wordLength = stored.wordLength;
    game.tileSize = stored.tileSize;
    game.totalGuesses = stored.totalGuesses;
    game.win = stored.win;
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

function touchStarted() {
  game.clicked(mouseX, mouseY);
}



function updateStats(guesses) {
  let i = guesses % game.totalGuesses;
  if (stats.p != game.secretWordIndex) {
    stats.s[i]++;
    stats.p = game.secretWordIndex;
  }
  storeItem("stats", stats);
}

// p5js Copy Text to Clipboard
// by Olaf Val
// based on example by Techoverflow
// https://techoverflow.net/2018/03/30/copying-strings-to-the-clipboard-using-pure-javascript/
function copyToClipboard(text) {
  // Create new element
  var el = document.createElement("textarea");
  // Set value (string to be copied)
  el.value = text;
  // Set non-editable to avoid focus and move outside of view
  // el.setAttribute('readonly', '');
  // el.style = {position: 'absolute', left: '-9999px'};
  document.body.appendChild(el);
  // Select text inside element
  el.select();
  // Copy text to clipboard
  document.execCommand("copy");
  // Remove temporary element
  document.body.removeChild(el);
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