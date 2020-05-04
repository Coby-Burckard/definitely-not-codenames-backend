const Card = require('./Card');
const { words } = require('./words.json');
const { RED, BLUE, WHITE, BLACK, HINTING, GUESSING } = require('./constants');

class Game {
  constructor() {
    this.cards = null;
    this.turnColor = null;
    this.mode = null;
    this.clueWord = null;
    this.clueNumber = null;
    this.gussedCount = null;
  }

  initialize() {
    const randomWords = words
      .slice()
      .sort(() => 0.5 - Math.random())
      .slice(0, 25);

    this.cards = randomWords
      .map((word, i) => {
        if (i < 9) {
          return Card.fromWordAndColor(word, RED);
        }

        if (i < 17) {
          return Card.fromWordAndColor(word, BLUE);
        }

        if (i === 17) {
          return Card.fromWordAndColor(word, BLACK);
        }

        return Card.fromWordAndColor(word, WHITE);
      })
      .sort(() => 0.5 - Math.random());

    this.turnColor = RED;
    this.mode = HINTING;
    this.gussedCount = 0;
  }

  toggleTurnColor() {
    if (this.turnColor === RED) {
      return (this.turnColor = BLUE);
    }

    return (this.turnColor = RED);
  }

  setHint(hintWord, count) {
    this.hintWord = hintWord;
    this.max = count + 1;
  }

  touch(cardIndex) {
    const card = this.cards[cardIndex];
    card.touch();
  }

  currentGameState() {
    const cardsAsObjects = this.cards.map(card => card.asObject());

    return {
      cards: cardsAsObjects,
      turnColor: this.turnColor,
      mode: this.mode,
      clueWord: this.clueWord,
      clueNumber: this.clueNumber,
      gussedCount: this.gussedCount,
    };
  }
}

module.exports = Game;
