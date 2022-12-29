// class to store the secret words and the full word list
class WordleWords {
  constructor() {
    this.allWords = loadStrings("fiveLetterWords.txt", function (data) {
      return data;
    });
    this.secretWords = loadStrings("secretWords.txt", function (data) {
      return data;
    });
  }
}

// class representing a letter tile
class Letter {
  constructor() {
    this.letterIndex = 26; // starts blank 
    this.color = 0; // color index 0-3: light grey, dark grey, yellow, green
    this.x = null; // letters don't have a position or size until they are drawn
    this.y = null;
    this.size = null;
  }
  
  // change the letter
  update(letterIndex) {
    this.letterIndex = letterIndex;
  }
  
  // draw the letter at x, y with given size
  show(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    image(letters[this.letterIndex], x, y, size, size, (this.color % 4) * 256, 0, 256, 256);
  }
  
  // was a letter clicked? update color if so
  clicked(x, y) {
    if (this.x && this.y && this.size &&
        x > this.x && x < this.x + this.size && 
        y > this.y && y < this.y + this.size) {
      this.color++;
    }
  }
  
  // reset color to 0
  resetColor() {
    this.color = 0;
  }
}