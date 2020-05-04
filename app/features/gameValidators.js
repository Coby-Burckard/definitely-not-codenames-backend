const { GUESSER, MASTER, RED, BLUE } = require('./constants');

const clickCardValid = (game, gameUser, cardIndex) => {
  const { turnColor } = game;
  const { team, role } = gameUser;

  if (!team || !role || !turnColor) {
    return false;
  }

  const card = game.cards[cardIndex];

  return turnColor === team && role === GUESSER && !card.touched;
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

module.exports = { clickCardValid, startGameValid };
