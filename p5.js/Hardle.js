// Hardle Game class that keeps track of the current day's game
class Hardle {
  constructor(words) {
    this.w = words;
    this.guessCount = 0; // number of guesses made
    this.guesses = []; // guessed words, guesses[guessCount] is the current word
    this.secretWordIndex = floor(
      (new Date() - new Date(2022, 4, 7)) / 60 / 60 / 24 / 1000
    ); // index of the current secret word
    this.wordLength = 5; // number of letters in the words
    this.tileSize = 40; // size of each tile
    this.totalGuesses = 9; // number if guesses you get;
    this.win = false;
    this.keyboard = new Keyboard(140);
    this.setup();
    this.board();
  }

  // setup a new game
  setup() {
    this.win = false;
    this.guessCount = 0;
    this.guesses = [];
    for (let i = 0; i < this.totalGuesses; i++) {
      let guess = new WordGuess(this.w.secretWords[this.secretWordIndex])
      this.guesses.push(guess);
    }
  }

  // additional setup buttons and screens
  board() {
    this.keyboard.show();
    this.makeInfoButton();
    this.makeResetButton();
    this.winScreen(this.win);
  }

  // return a string score of the game i.e "4/9"
  score() {
    let guessOrX;
    if (this.guessCount == this.totalGuesses && !this.win) {
      guessOrX = "X";
    } else {
      guessOrX = str(this.guessCount);
    }
    let score =
      "Hardle " +
      str(this.secretWordIndex) +
      " " +
      guessOrX +
      "/" +
      str(this.totalGuesses);
    return score;
  }

  // create message for sharing scores
  share() {
    let copyPaste = this.score();
    let boxes = [copyPaste];
    let emoji = ["⚪", "🟡", "🟢"];
    for (let n = 0; n < this.guessCount; n++) {
      let guess = this.guesses[n];
      let tempBoxes = "";
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < guess.getPegs()[i]; j++) {
          tempBoxes += emoji[i];
        }
      }
      boxes.push(tempBoxes);
      copyPaste += "\r" + tempBoxes;
    }
    copyToClipboard(copyPaste + "\rtinyurl.com/hardlegame");
    alert(copyPaste +  "\rtinyurl.com/hardlegame" + "\r\rCopy to clipboard.");
  }

  // make the share button
  makeShareButton() {
    let shareButton = createButton("SHARE");
    shareButton.style("font-size", "28px");
    shareButton.style("color", "black");
    shareButton.style("background-color", "rgb(119, 216, 71)");
    shareButton.size(120, 40);
    shareButton.position(width * 0.6, height * 0.85);
    shareButton.mouseClicked(function () {
      game.share();
    });
  }

  // show tutorial screen
  showInfo() {
    let info = createImg("/images/info.png", "");
    info.size(400, 530);
    info.position(8, 8);
    info.mousePressed(() => info.remove());
  }

  // make tutorial screen toggle button
  makeInfoButton() {
    let infoButton = createImg("/images/i.png", "");
    infoButton.size(30, 30);
    infoButton.position(width * 0.06, 17);
    infoButton.mousePressed(() => this.showInfo());
  }

  // make a reset colors button
  makeResetButton() {
    let resetButton = createImg("/images/reset.png", "");
    resetButton.size(60, 30);
    resetButton.position(width * 0.86, 17);
    resetButton.mousePressed(() => {
      for (let guess of this.guesses) {
        guess.resetColors();
      }
    });
  }

  // takes physical and virtual keyboard inputs
  keyPressed(l) {
    if (this.guessCount < this.totalGuesses && !this.win) {
      let current = this.guesses[this.guessCount];
      if (l != null && l != "⌫" && l != "ENTER") {
        key = l;
      }
      if (key == "Backspace" || l == "⌫") {
        current.deleteLetter();
      } else if (key == "Enter" || l == "ENTER") {
        if (current.guessMade(this.wordLength, this.w.allWords)) {
          this.guessCount++;
          this.winScreen(current.win || this.guessCount == this.totalGuesses);
          this.storeData();
        }
      } else {
        current.addLetter(key.toUpperCase());
      }
    }
  }
  
  // passes clicks onto the tiles
  clicked(x, y) {
    for (let i = 0; i < this.guessCount; i++) {
      this.guesses[i].clicked(x, y);
    }
  }

  // displays the winscreen of the game is over
  winScreen(won) {
    this.win = won;
    if (this.win) {
      removeElements();
      this.makeShareButton();
      updateStats(this.guessCount);
    }
  }

  endScreen() {
    push();
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
    this.stats(stats);
    textSize(20);
    text("NEXT HARDLE", width * 0.25, height * 0.82);
    textSize(40);
    text(this.getTimer(), width * 0.25, height * 0.92);
    rect(width / 2, height * 0.875, 2, 85);
    pop();
  }

  stats(stats) {
    let s = stats.s;
    fill(0);
    textSize(20);
    text("Stats:", width / 2, height / 4.5);
    textSize(25);
    text("Played        Win %", width / 2, height / 3.5);
    let total = s.reduce((partialSum, a) => partialSum + a, 0);
    text(total, width / 3, height / 2.8);
    text(
      nf(
        (s.reduce((partialSum, a) => partialSum + a, -s[0]) / total) * 100,
        2,
        2
      ),
      (width * 2) / 3,
      height / 2.8
    );
    textSize(20);
    text("Guesses", width / 2, height / 2.4);
    push();
    fill(255);
    stroke(0);
    rect(width / 2, height / 1.65, width / 1.5, height / 3);
    pop();
    textSize(15);
    text("1\n2\n3\n4\n5\n6\n7\n8\n9", width / 4.5, height / 1.65);
    text(
      s[1] +
        "\n" +
        s[2] +
        "\n" +
        s[3] +
        "\n" +
        s[4] +
        "\n" +
        s[5] +
        "\n" +
        s[6] +
        "\n" +
        s[7] +
        "\n" +
        s[8] +
        "\n" +
        s[9],
      (width * 3.5) / 4.5,
      height / 1.65
    );
    this.statsBars(stats);
  }

  statsBars(stats) {
    let s = stats.s;
    let total = s.reduce((partialSum, a) => partialSum + a, 0);
    push();
    rectMode(CORNER);
    fill("gray");
    stroke(0);
    if (total != 0) {
      for (let i = 1; i < s.length; i++) {
        push();
        if (i == this.guessCount) {
          fill(119, 216, 71);
        }
        rect(
          width / 4,
          height / 2.2 + (i - 1) * 18.75,
          (width / 2) * (stats.s[i] / total),
          10
        );
        pop();
      }
    }
    pop();
  }

  getTimer() {
    let time =
      this.addZero(23 - hour()) +
      ":" +
      this.addZero(60 - minute()) +
      ":" +
      this.addZero(60 - second());
    return time;
  }

  addZero(time) {
    if (str(time).length == 1) {
      time = "0" + time;
    }
    return time;
  }

  play() {
    if (this.win || this.guessCount == this.totalGuesses) {
      this.endScreen();
    } else {
      for (let i = 0; i < this.totalGuesses; i++) {
        this.guesses[i].pegs.draw(i, this.tileSize);
        for (let j = 0; j < this.wordLength; j++) {
          this.guesses[i].update(j, i, this.tileSize);
        }
      }
    }
  }

  storeData() {
    let hardle = {
      guessCount: this.guessCount,
      guesses: aMap(this.guesses, WordGuess.toJSON),
      secretWordIndex: this.secretWordIndex,
      wordLength: this.wordLength,
      tileSize: this.tileSize,
      totalGuesses: this.totalGuesses,
      win: this.win,
    };
    storeItem(
      "Hardle" +
        floor((new Date() - new Date(2022, 4, 7)) / 60 / 60 / 24 / 1000),
      hardle
    );
  }
}
