class Card {
  constructor(word, color) {
    this.word = word;
    this.color = color;
    this.touched = false;
  }

  static fromWordAndColor(word, color) {
    return new Card(word, color);
  }

  touch() {
    this.touched = true;
    return this.color;
  }

  asObject() {
    return {
      word: this.word,
      color: this.color,
      touched: this.touched,
    };
  }
}

module.exports = Card;
