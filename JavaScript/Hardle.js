// Hardle Game class that keeps track of the current day's game
class Hardle {
  constructor(words) {
    this.w = words;
    this.guessCount = 0; // number of guesses made
    this.guesses = []; // guessed words, guesses[guessCount] is the current word
    this.secretWordIndex = floor(
      (new Date() - new Date(2022, 4, 7)) / 60 / 60 / 24 / 1000
    ); // index of the current secret word
    this.tileSize = 40; // size of each tile
    this.totalGuesses = 9; // number if guesses you get;
    this.keyboard; //
    this.win = false; // did the player win
    this.setup();
  }

  // fill in guess list with WordGuess objects
  setup() {
    for (let i = 0; i < this.totalGuesses; i++) {
      let guess = new WordGuess(
        this.w.secretWords[this.secretWordIndex],
        i,
        this.tileSize
      );
      this.guesses.push(guess);
    }
  }

  // additional setup buttons and screens
  board() {
    this.keyboard = new Keyboard(this);
    // if the game is over show the share button only
    if (this.win || this.guessCount == this.totalGuesses) {
      this.makeShareButton();
    } else {
      // otherwise...
      // update all guesses to show the current game data
      for (let i = 0; i < this.guessCount; i++) {
        this.guesses[i].build();
      }
      this.makeInfoButton();
    }
    game.update();
  }

  // update screen and save
  update() {
    // set the background
    background("lightgray");
    // if the game is over show the end screen
    if (this.win || this.guessCount == this.totalGuesses) {
      this.endScreen();
    } else {
      // otherwise draw the pegs and the tiles
      for (let i = 0; i < this.totalGuesses; i++) {
        this.guesses[i].draw();
      }
      // draw keyboard
      this.keyboard.draw();
    }
    this.storeData();
  }

  // takes physical and virtual keyboard inputs
  keyPressed(keyPressed) {
    // make sure the game is still live
    if (this.guessCount < this.totalGuesses && !this.win) {
      // get the current word
      let current = this.guesses[this.guessCount];
      // check for delete/backspace
      if (keyPressed == "Backspace" || keyPressed == "⌫") {
        current.deleteLetter();
        // check for enter/return
      } else if (keyPressed == "Enter" || keyPressed == "ENTER") {
        // ensure valid guess before submitting
        if (current.guessMade(this.w.allWords)) {
          // increase guess count and store current game
          this.guessCount++;
          this.storeData();
          // the game ends after the last guess or the correct guess
          if (current.win || this.guessCount == this.totalGuesses) {
            this.gameOver(current.win);
          }
        }
      } else {
        // pass on to current guess to determine which letter (if any) was pressed
        current.addLetter(keyPressed.toUpperCase());
      }
      this.update();
    }
  }

  // get the colors of tiles that have been guessed
  // colors are represented by an integer 0-3
  getTileColors() {
    let tileColors = {};
    for (let i = 0; i < this.guessCount; i++) {
      let indexGuess = this.guesses[i];
      let guessColors = indexGuess.getColors();
      for (let j = 0; j < 5; j++) {
        let letter = indexGuess.word[j];
        let tileColor = guessColors[j];
        if (!(letter in tileColors)) {
          tileColors[letter] = tileColor;
        } else if (tileColor > tileColors[letter]) {
          tileColors[letter] = tileColor;
        }
      }
    }
    return tileColors;
  }

  // create message for sharing scores
  share() {
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
    print(copyPaste);
    copyPaste += "\rhttps://hardle.netlify.app/";
    // copy to clipboard and create a popup
    window.navigator.clipboard.writeText(copyPaste).then(function (x) {
      window.alert(copyPaste + "\r\rCopy to clipboard.");
    });
  }

  // return a string score of the game i.e "4/9"
  score() {
    let guessOrX;
    // if the game was lost X/9 is the score
    if (this.guessCount == this.totalGuesses && !this.win) {
      guessOrX = "X";
    } else {
      // if the game was won use the number of guesses
      guessOrX = str(this.guessCount);
    }
    let score =
      "Hardle " +
      str(this.secretWordIndex) +
      " " +
      guessOrX +
      "/" +
      str(this.totalGuesses);
    // return the string
    return score;
  }

  // make the share button
  makeShareButton() {
    // remove all elements
    removeElements();
    // create new share button
    let shareButton = createButton("SHARE");
    shareButton.style("font-size", "28px");
    shareButton.style("color", "black");
    shareButton.style("background-color", "rgb(119, 216, 71)");
    shareButton.size(120, 40);
    shareButton.position(width * 0.6, height * 0.85);
    // when clicked copy and show the share message
    shareButton.mouseClicked(() => this.share());
    // set parent for relative position and scaling
    shareButton.parent("sketch");
  }

  // show tutorial screen
  showInfo() {
    let info = createImg("/images/info.png", "");
    // tutorial image is always on top
    info.style("zIndex", "10");
    info.size(400, 530);
    info.position(0, 0);
    // when clicked hide the image
    info.mousePressed(() => info.remove());
    // set parent for relative position and scaling
    info.parent("sketch");
  }

  // make tutorial screen toggle button
  makeInfoButton() {
    let infoButton = createImg("/images/i.png", "");
    infoButton.size(30, 30);
    infoButton.position(width * 0.835, 17);
    // when clicked show the tutorial image
    infoButton.mousePressed(() => this.showInfo());
    // set parent for relative position and scaling
    infoButton.parent("sketch");
  }

  // end the game
  gameOver(won) {
    // update the state of the game to won or lost
    this.win = won;
    // create remove other buttons and share button
    this.makeShareButton();
    // store the data from the game
    this.storeData();
    // update the stats
    this.updateStats();
  }

  // what to show on the end screen
  endScreen() {
    // score text and word reveal
    noStroke();
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    textStyle("bold");
    fill("green");
    textSize(40);
    text(
      this.score() + ":\n" + this.w.secretWords[this.secretWordIndex],
      width / 2,
      50
    );
    // draw statistics using global stats variable (from sketch.js)
    this.stats(stats);
    fill("black");
    textSize(20);
    // new hardle countdown
    rect(width / 2, height * 0.875, 2, 85);
    text("NEXT HARDLE", width * 0.25, height * 0.82);
    this.addTimer();
    pop();
  }

  // show stats bars for overall score
  stats(statistics) {
    push();
    // get guess count information from stats
    let scores = statistics.s;
    fill(0);
    textSize(20);
    // show basic games played and win/loss information
    text("Stats:", width / 2, height / 4.5);
    textSize(25);
    text("Played        Win %", width / 2, height / 3.5);
    let total = scores.reduce((partialSum, a) => partialSum + a, 0);
    text(total, width / 3, height / 2.8);
    text(
      nf(
        (scores.reduce((partialSum, a) => partialSum + a, -scores[0]) / total) *
          100,
        2,
        2
      ),
      (width * 2) / 3,
      height / 2.8
    );
    // stats bar text for history of number of guesses taken
    textSize(20);
    text("Guesses", width / 2, height / 2.4);
    push();
    fill(255);
    stroke(0);
    rect(width / 2, height / 1.65, width / 1.5, height / 3);
    pop();
    textSize(15);
    text(
      "\n\n\n\n\n\n\n\n\n1\n2\n3\n4\n5\n6\n7\n8\n9",
      width / 4.5,
      height / 2.23
    );
    text(
      "\n\n\n\n\n\n\n\n\n" +
        scores[1] +
        "\n" +
        scores[2] +
        "\n" +
        scores[3] +
        "\n" +
        scores[4] +
        "\n" +
        scores[5] +
        "\n" +
        scores[6] +
        "\n" +
        scores[7] +
        "\n" +
        scores[8] +
        "\n" +
        scores[9],
      (width * 3.5) / 4.5,
      height / 2.23
    );
    // draw the stats bars
    this.statsBars(scores);
    pop();
  }

  // draw rectangles corresponding to win guess-count history
  statsBars(scores) {
    // add up total games played
    let max = 0;
    for (let i = 1; i < scores.length; i++) {
      let score = scores[i];
      if (score > max) {
        max = score;
      }
    }
    push();
    rectMode(CORNER);
    fill("gray");
    stroke(0);
    // draw grey rectangles with proportional lengths
    if (max != 0) {
      for (let i = 1; i < scores.length; i++) {
        push();
        // color them green rather than gray for the current guess count
        if (i == this.guessCount) {
          fill(119, 216, 71);
        }
        rect(
          width / 4.1,
          height / 2.2 + (i - 1) * 18.75,
          (width / 2) * (scores[i] / max) + 5,
          10
        );
        pop();
      }
    }
    pop();
  }

  // get time until next hardle at midnight local time
  addTimer() {
    // cover previous time
    push();
    fill("lightgray");
    rect(width * 0.25, height * 0.92, 175, 40);
    pop();
    let time =
      this.addZero(23 - hour()) +
      ":" +
      this.addZero(60 - minute()) +
      ":" +
      this.addZero(60 - second());
    textSize(40);
    text(time, width * 0.25, height * 0.92);
    sleep(1000).then(() => this.addTimer());
  }

  // helper function for formatting the timer to 00:00:00 format
  addZero(time) {
    if (str(time).length == 1) {
      time = "0" + time;
    }
    return time;
  }

  // update the stored stats from previous days
  updateStats() {
    // represents the index in the score to store the number of guesses:
    let score = this.guessCount;
    // score is zero if the game was lost
    if (!this.win) {
      score = 0;
    }
    // if the current game index is diffrent from the most recently saved index
    if (stats.p != this.secretWordIndex) {
      // update score and most recent saved index to avoid double counting
      stats.s[score]++;
      stats.p = this.secretWordIndex;
    }
    // store in local browser storage
    storeItem("stats", stats);
  }

  // store the data from the current game for reloading later
  storeData() {
    let guesses = [];
    for (let i = 0; i < this.totalGuesses; i++) {
      guesses.push(this.guesses[i].toJSON());
    }
    let hardle = {
      guessCount: this.guessCount,
      guesses: guesses,
      secretWordIndex: this.secretWordIndex,
      tileSize: this.tileSize,
      totalGuesses: this.totalGuesses,
      win: this.win,
    };
    // store in local browser storage with corresponding date
    storeItem("Hardle", hardle);
  }

  // load game from json
  static loadData(json, words) {
    let game = new Hardle(words);
    game.guessCount = json.guessCount;
    game.secretWordIndex = json.secretWordIndex;
    game.tileSize = json.tileSize;
    game.totalGuesses = json.totalGuesses;
    game.win = json.win;
    game.guesses = aMap(json.guesses, WordGuess.fromJSON);
    game.guesses[json.guessCount].clear();
    return game;
  }
}
