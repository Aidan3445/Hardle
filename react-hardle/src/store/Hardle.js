import HardleWords from "../data/HardleWords.json";
import { darkgray, yellow, green, white } from "../App.js";

// tile color indices (match the colors array in App.js)
const LIGHT = 0; // undecided
const DARK = 1; // excluded
const YELLOW = 2;
const GREEN = 3;

var store = {
  // the current secret word
  secretWord: "",
  // guessed words
  guesses: [],
  // colors of the tiles for each word
  tileColors: [],
  // guesses[guessCount] is the current word
  guessCount: 0,
  // show stats page after game
  showStats: false,

  // setup the game
  init() {
    var savedState = JSON.parse(this.load());
    var todaysWord = HardleWords.secretWords[this.day];
    if (savedState && savedState.secretWord === todaysWord) {
      this.secretWord = savedState.secretWord;
      this.guesses = savedState.guesses;
      this.tileColors = savedState.tileColors;
      this.guessCount = savedState.guessCount;
    } else {
      this.secretWord = todaysWord;
      this.guesses = [...Array(9).fill("")];
      this.tileColors = Array.from({ length: 9 }, () => []);
      this.guessCount = 0;
    }
    this.showStats = this.won || this.lost;
  },

  // get day of Hardle
  // returns index of secretWords list
  get day() {
    return Math.floor(
      (new Date() - new Date(2022, 4, 7)) / 60 / 60 / 24 / 1000
    );
  },

  // was the game won
  // returns bool
  get won() {
    return (
      this.guessCount !== 0 &&
      this.guesses[this.guessCount - 1] === this.secretWord
    );
  },

  // was the game lost
  // returns bool
  get lost() {
    return this.guessCount === 9;
  },

  // events when physical or virtual key pressed
  // returns false if the guess is invalid
  keyPressed(key) {
    if (this.won || this.lost) {
      return true;
    }
    var currentWord = this.guesses[this.guessCount];
    var currentColors = this.tileColors[this.guessCount];
    switch (key) {
      case "Backspace":
        this.guesses[this.guessCount] = currentWord.slice(
          0,
          currentWord.length - 1
        );
        this.tileColors[this.guessCount] = currentColors.slice(
          0,
          currentColors.length - 1
        );
        break;
      case "Enter":
        if (currentWord.length === 5) {
          if (HardleWords.allWords.includes(currentWord) || HardleWords.secretWords.includes(currentWord)) {
            this.guessCount += 1;
            this.onGuessSubmitted(this.guessCount - 1);
            this.onWinLoss();
          } else {
            // 5 letters typed but word is invalid
            return false;
          }
        }
        break;
      default:
        if (currentWord.length < 5 && key.match(/^[a-zA-Z]$/)) {
          var letter = key.toUpperCase();
          this.guesses[this.guessCount] = currentWord + letter;
          this.tileColors[this.guessCount].push(
            this.inferColor(letter, currentWord.length)
          );
        }
    }
    return true;
  },

  // is a row submitted
  isSubmitted(wordIndex) {
    return wordIndex < this.guessCount;
  },

  // peg counts for a submitted guess
  // returns { [GREEN]: g, [YELLOW]: y, [DARK]: d }
  getPegCounts(wordIndex) {
    let g = 0;
    let y = 0;
    let word = [...this.guesses[wordIndex]];
    let target = [...this.secretWord];
    target = target.map((letter, index) => {
      if (letter === word[index]) {
        g++;
        word[index] = "0";
        return "1";
      }
      return letter;
    });
    target.forEach((letter) => {
      if (word.indexOf(letter) !== -1) {
        y++;
        word[word.indexOf(letter)] = "0";
      }
    });
    return { [GREEN]: g, [YELLOW]: y, [DARK]: 5 - g - y };
  },

  // monochromatic peg result: returns the single color, or null
  monochromeColor(wordIndex) {
    if (!this.isSubmitted(wordIndex)) {
      return null;
    }
    const pegs = this.getPegCounts(wordIndex);
    for (const color of [DARK, YELLOW, GREEN]) {
      if (pegs[color] === 5) return color;
    }
    return null;
  },

  // free information from monochromatic results; derived from the pegs, so
  // clearing tiles never removes it
  getFacts() {
    const facts = { excluded: new Set(), minCount: {}, notAt: {} };
    for (let w = 0; w < this.guessCount; w++) {
      const mono = this.monochromeColor(w);
      const word = this.guesses[w];
      if (mono === DARK) {
        [...word].forEach((l) => facts.excluded.add(l));
      } else if (mono === YELLOW) {
        const counts = {};
        [...word].forEach((l, i) => {
          counts[l] = (counts[l] || 0) + 1;
          (facts.notAt[l] = facts.notAt[l] || new Set()).add(i);
        });
        Object.entries(counts).forEach(([l, n]) => {
          facts.minCount[l] = Math.max(facts.minCount[l] || 0, n);
        });
      }
    }
    return facts;
  },

  // copies of a tile's letter elsewhere in the word with one of the colors
  countCopies(word, letterIndex, colors, wanted) {
    return [...word].filter(
      (l, j) =>
        j !== letterIndex && l === word[letterIndex] && wanted(colors[j])
    ).length;
  },

  // is a color possible for a tile given the free facts
  allowedByFacts(word, letterIndex, color, colors, facts) {
    const letter = word[letterIndex];
    if (facts.excluded.has(letter)) {
      return color === DARK;
    }
    if (color === GREEN && facts.notAt[letter]?.has(letterIndex)) {
      return false;
    }
    const known = facts.minCount[letter] || 0;
    if (color === DARK && known > 0) {
      // only copies beyond the known count may go without a peg
      const copies = [...word].filter((l) => l === letter).length;
      const maxDark = copies - Math.min(copies, known);
      return this.countCopies(word, letterIndex, colors, (c) => c === DARK) < maxDark;
    }
    return true;
  },

  // the player's tiles with the free facts applied
  baseColors(wordIndex, facts) {
    const word = this.guesses[wordIndex];
    const colors = [];
    this.tileColors[wordIndex].forEach((mark, i) => {
      if (facts.excluded.has(word[i])) {
        colors.push(DARK);
      } else if (mark !== LIGHT && !this.allowedByFacts(word, i, mark, colors, facts)) {
        colors.push(LIGHT);
      } else {
        colors.push(mark);
      }
    });
    return colors;
  },

  // displayed colors for a row: the base colors plus anything the pegs force
  rowColors(wordIndex, facts = this.getFacts()) {
    const colors = this.baseColors(wordIndex, facts);
    if (!this.isSubmitted(wordIndex)) {
      return colors;
    }
    const word = this.guesses[wordIndex];
    const pegs = this.getPegCounts(wordIndex);
    for (let changed = true; changed; ) {
      changed = false;
      const remaining = {};
      [DARK, YELLOW, GREEN].forEach((c) => {
        remaining[c] = pegs[c] - colors.filter((x) => x === c).length;
      });
      const open = [0, 1, 2, 3, 4].filter((i) => colors[i] === LIGHT);
      const options = open.map((i) =>
        [DARK, YELLOW, GREEN].filter(
          (c) =>
            remaining[c] > 0 &&
            this.allowedByFacts(word, i, c, colors, facts)
        )
      );
      // a tile with only one possible color
      const single = options.findIndex((o) => o.length === 1);
      if (single !== -1) {
        colors[open[single]] = options[single][0];
        changed = true;
        continue;
      }
      // a color with exactly as many open tiles as remaining pegs
      for (const c of [GREEN, YELLOW, DARK]) {
        const fits = open.filter((_, k) => options[k].includes(c));
        if (remaining[c] > 0 && fits.length === remaining[c]) {
          fits.forEach((i) => (colors[i] = c));
          changed = true;
          break;
        }
      }
    }
    return colors;
  },

  // displayed color of a single tile
  getTileColor(wordIndex, letterIndex) {
    return this.rowColors(wordIndex)[letterIndex];
  },

  // is the row's result monochromatic (fully given for free)
  isMonochrome(wordIndex) {
    return this.monochromeColor(wordIndex) !== null;
  },

  // color for a newly typed letter: only what is certain for any guess,
  // a green in the same slot or an excluded letter (a yellow elsewhere could
  // be green or have no peg here, so it stays undecided)
  inferColor(letter, letterIndex) {
    const facts = this.getFacts();
    if (facts.excluded.has(letter)) {
      return DARK;
    }
    let inWord = !!facts.minCount[letter];
    let excluded = false;
    for (let w = 0; w < this.guessCount; w++) {
      const word = this.guesses[w];
      const colors = this.rowColors(w, facts);
      for (let i = 0; i < 5; i++) {
        if (word[i] !== letter) continue;
        if (colors[i] === GREEN && i === letterIndex) {
          return GREEN;
        } else if (colors[i] >= YELLOW) {
          inWord = true;
        } else if (
          colors[i] === DARK &&
          !this.countCopies(word, i, colors, (c) => c >= YELLOW)
        ) {
          excluded = true;
        }
      }
    }
    return excluded && !inWord ? DARK : LIGHT;
  },

  // cycle a tile to its next possible color; the tapped tile is taken as truth
  // and the rest of the grid is updated to match
  tileClicked(wordIndex, letterIndex) {
    const word = this.guesses[wordIndex];
    if (word.length <= letterIndex) {
      return;
    }
    const facts = this.getFacts();
    const marks = this.tileColors[wordIndex];
    const before = this.rowColors(wordIndex, facts);
    const base = this.baseColors(wordIndex, facts);
    const current = before[letterIndex];
    const submitted = this.isSubmitted(wordIndex);
    const pegs = submitted && this.getPegCounts(wordIndex);
    const used = (c) => base.filter((x, j) => j !== letterIndex && x === c).length;
    // every colored peg already shows on a tile
    const exhausted =
      submitted &&
      [GREEN, YELLOW].every(
        (c) => before.filter((x) => x === c).length === pegs[c]
      );
    // dark tiles and tiles the solver filled in may take a color you set
    const canTake = exhausted && (current === DARK || base[letterIndex] === LIGHT);

    let next = LIGHT;
    for (let step = 1; step < 4; step++) {
      const color = (current + step) % 4;
      if (color === LIGHT) {
        // skip undecided if the pegs would force the same color right back
        marks[letterIndex] = LIGHT;
        if (this.rowColors(wordIndex, facts)[letterIndex] !== current) break;
        continue;
      }
      if (!this.allowedByFacts(word, letterIndex, color, base, facts)) continue;
      if (!submitted || used(color) < pegs[color]) {
        next = color;
        break;
      }
      const donor = base.findIndex((c, j) => j !== letterIndex && c === color);
      if (canTake && color >= YELLOW && donor !== -1) {
        marks[donor] = LIGHT;
        next = color;
        break;
      }
    }
    marks[letterIndex] = next;

    // push every tile whose color changed, the tapped tile last so it wins
    const after = this.rowColors(wordIndex, facts);
    const changed = [0, 1, 2, 3, 4].filter(
      (j) => j !== letterIndex && j < word.length && after[j] !== before[j]
    );
    if (after[letterIndex] !== before[letterIndex]) {
      changed.push(letterIndex);
    }
    changed.forEach((j) => this.syncLetter(wordIndex, j, after, facts));
  },

  // push a tile's color to every instance of the letter in other rows
  syncLetter(wordIndex, letterIndex, rowColors, facts) {
    const letter = this.guesses[wordIndex][letterIndex];
    const color = rowColors[letterIndex];

    // no peg says nothing about the letter when its double here is colored
    if (
      color <= DARK &&
      this.countCopies(this.guesses[wordIndex], letterIndex, rowColors, (c) => c >= YELLOW)
    ) {
      return;
    }

    const lastRow = Math.min(this.guessCount, 8);
    for (let w = 0; w <= lastRow; w++) {
      const word = this.guesses[w];
      if (w === wordIndex || !word.includes(letter)) continue;
      const submitted = this.isSubmitted(w);
      const pegs = submitted && this.getPegCounts(w);
      const marks = this.tileColors[w];
      const shown = this.rowColors(w, facts);
      // same slot first so doubles are judged against it
      const indices = [...word]
        .map((l, i) => (l === letter ? i : -1))
        .filter((i) => i !== -1)
        .sort((a, b) => (b === letterIndex) - (a === letterIndex));
      // an excluded double next to a colored copy is deliberate
      const deliberateDark = indices.map(
        (i) =>
          marks[i] === DARK &&
          this.countCopies(word, i, shown, (c) => c >= YELLOW) > 0
      );

      indices.forEach((i, k) => {
        if (facts.excluded.has(letter)) return;
        const base = this.baseColors(w, facts);
        let desired = color;
        if (color === GREEN && i !== letterIndex) desired = YELLOW;
        // the guess being typed only takes certain colors, never a yellow
        if (!submitted && desired === YELLOW) desired = LIGHT;
        // a green elsewhere may be a double letter
        if (desired === YELLOW && base[i] === GREEN && i !== letterIndex) return;
        if (desired >= YELLOW && deliberateDark[k]) return;
        if (base[i] === desired) return;
        const fits =
          desired === LIGHT ||
          (this.allowedByFacts(word, i, desired, base, facts) &&
            (!submitted ||
              base.filter((c, j) => j !== i && c === desired).length <
                pegs[desired]));
        // otherwise clear the color the tap contradicts
        marks[i] = fits ? desired : LIGHT;
      });
    }
  },

  // fit a newly submitted row to its pegs
  onGuessSubmitted(wordIndex) {
    const pegs = this.getPegCounts(wordIndex);
    const row = this.tileColors[wordIndex];
    const used = { [DARK]: 0, [YELLOW]: 0, [GREEN]: 0 };
    row.forEach((c, i) => {
      if (c === LIGHT) return;
      if (used[c] < pegs[c]) {
        used[c]++;
      } else {
        row[i] = LIGHT;
      }
    });
  },

  // reset the tile colors for a word (only that row; free facts remain)
  resetWordColors(wordIndex) {
    this.tileColors[wordIndex].fill(LIGHT);
  },

  // does a word have any colored tiles
  // returns bool
  isWordColored(wordIndex) {
    return this.tileColors[wordIndex].some((val) => val !== LIGHT);
  },

  // get the color to set a key
  // returns color index 0-3
  getKeyColor(letter) {
    const facts = this.getFacts();
    letter = letter.toUpperCase();
    let maxColor = facts.excluded.has(letter) ? DARK : LIGHT;
    this.guesses.forEach((word, w) => {
      if (!word.includes(letter)) return;
      const colors = this.rowColors(w, facts);
      [...word].forEach((l, i) => {
        if (l === letter) maxColor = Math.max(maxColor, colors[i]);
      });
    });
    return maxColor;
  },

  // get pegs for a guess
  // return color array
  getPegs(wordIndex) {
    if (!this.isSubmitted(wordIndex)) {
      return Array(5).fill(white);
    }
    const pegs = this.getPegCounts(wordIndex);
    return [
      ...Array(pegs[YELLOW]).fill(yellow),
      ...Array(pegs[GREEN]).fill(green),
      ...Array(pegs[DARK]).fill(darkgray),
    ];
  },

  // toggle show stats
  toggleStats() {
    if (this.won || this.lost) {
      this.showStats = !this.showStats;
    }
  },

  // save game state to localStorage
  save() {
    var gameState = {
      secretWord: this.secretWord, // add encryption
      guesses: [...this.guesses],
      tileColors: [...[...this.tileColors]],
      guessCount: this.guessCount,
    };
    localStorage.setItem("7lEU8htFNd", JSON.stringify(gameState));
  },

  // load game state from localStorage
  load() {
    return localStorage.getItem("7lEU8htFNd");
  },

  // get stats
  // returns stats array
  get stats() {
    var stats = localStorage.getItem("25bkUH9cO0P");

    if (stats) {
      var statsArray = stats.split(",").map((x) => parseInt(x));
      return statsArray;
    }

    return this.newStats;
  },

  // create, save, and return a new stats array
  get newStats() {
    var statsArray = [...Array(10).fill(0)];
    localStorage.setItem("25bkUH9cO0P", statsArray);
    return statsArray;
  },

  // run once on win/loss to update stats
  onWinLoss() {
    if (this.won || this.lost) {
      var currentStats = this.stats
      if (this.won) {
        currentStats[this.guessCount] += 1;
      } else if (this.lost) {
        currentStats[0] += 1;
      }
      localStorage.setItem("25bkUH9cO0P", currentStats);
      this.showStats = true;
    }
  },
};

export default store;
