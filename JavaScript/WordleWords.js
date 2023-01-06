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
