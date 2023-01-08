// class to store the secret words and the full word list
class WordleWords {
  constructor() {
    this.allWords = loadStrings("fiveLetterWords.txt", (data) => data);
    this.secretWords = loadStrings("secretWords.txt", (data) => data);
  }
}
