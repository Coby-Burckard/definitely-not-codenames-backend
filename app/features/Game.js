const Card = require('./Card');
const { words } = require('./words.json');
const { RED, BLUE, WHITE, BLACK, HINTING, GUESSING } = require('./constants');

class Game {
  constructor() {
    this.cards = null;

    this.mode = null;
    this.turnColor = null;

    this.clueWord = null;
    this.clueNumber = null;

    this.guessedCount = null;
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
    this.guessedCount = 0;
  }

  toggleTurnColor() {
    if (this.turnColor === RED) {
      return (this.turnColor = BLUE);
    }

    return (this.turnColor = RED);
  }

  toggleModeGuessing() {
    this.mode = GUESSING;
    this.guessedCount = 0;
  }

  toggleModeHinting() {
    this.mode = HINTING;
    this.guessedCount = null;
  }

  clearClue() {
    this.clueWord = null;
    this.clueNumber = null;
  }

  setClueWordAndNumber(clueWord, clueNumber) {
    this.clueWord = clueWord;
    this.clueNumber = clueNumber;
  }

  touch(cardIndex) {
    const card = this.cards[cardIndex];

    const maxGuesses = this.clueNumber + 1;
    this.guessedCount += 1;

    const touchedColor = card.touch();

    if (touchedColor === this.turnColor && this.guessedCount < maxGuesses) {
      return;
    }

    if (touchedColor === this.turnColor && this.guessedCount === maxGuesses) {
      this.toggleModeHinting();
      this.clearClue();
      return this.toggleTurnColor();
    }

    if (touchedColor === WHITE || touchedColor !== this.turnColor) {
      this.toggleModeHinting();
      this.clearClue();
      return this.toggleTurnColor();
    }

    if (touchedColor === BLACK) {
      // FIXME: This should end the game
      this.toggleModeHinting();
      this.clearClue();
      return this.toggleTurnColor();
    }
  }

  pass() {
    this.toggleModeHinting();
    this.clearClue();
    return this.toggleTurnColor();
  }

  currentGameState() {
    const cardsAsObjects = this.cards.map(card => card.asObject());

    return {
      cards: cardsAsObjects,
      turnColor: this.turnColor,
      mode: this.mode,
      clueWord: this.clueWord,
      clueNumber: this.clueNumber,
      guessedCount: this.guessedCount,
    };
  }
}

module.exports = Game;
