const {
  GUESSER,
  MASTER,
  RED,
  BLUE,
  HINTING,
  GUESSING,
} = require('./constants');

const clickCardValid = (game, gameUser, cardIndex) => {
  const { turnColor, mode } = game;
  const { team, role } = gameUser;

  if (!team || !role || !turnColor || !mode) {
    return false;
  }

  const card = game.cards[cardIndex];

  return (
    turnColor === team && role === GUESSER && !card.touched && mode === GUESSING
  );
};

const startGameValid = room => {
  let redMaster = false;
  let redGuesser = false;
  let blueMaster = false;
  let blueGuesser = false;

  room.users.forEach(gameUser => {
    if (gameUser.team === RED && gameUser.role === MASTER) {
      redMaster = true;
    }

    if (gameUser.team === RED && gameUser.role === GUESSER) {
      redGuesser = true;
    }

    if (gameUser.team === BLUE && gameUser.role === MASTER) {
      blueMaster = true;
    }

    if (gameUser.team === BLUE && gameUser.role === GUESSER) {
      blueGuesser = true;
    }
  });

  return redMaster && redGuesser && blueMaster && blueGuesser;
};

const setClueValid = (game, gameUser) => {
  const { mode, turnColor } = game;
  const { team, role } = gameUser;

  return mode === HINTING && turnColor === team && role === MASTER;
};

module.exports = { clickCardValid, startGameValid, setClueValid };
