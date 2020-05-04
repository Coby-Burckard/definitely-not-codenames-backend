const uid = require('uid-safe');

const { RED, BLUE, GUESSER, MASTER } = require('./constants');

const Feed = require('./Feed');
const Game = require('./Game');

const Response = require('./Response');

class Room {
  constructor() {
    this.id = uid.sync(24);
    this.feed = new Feed();
    this.users = new Map();
    this.game = new Game();
  }

  sendObjectToUsers(app, response) {
    this.users.forEach((gameUser, userID) => {
      const roomUserConnection = app.users.get(userID).connection;
      roomUserConnection.send(Response.fromObject(response));
    });
  }

  sendGameUsersToRoom(app) {
    const gameUsers = [];
    this.users.forEach(gameUser => {
      gameUsers.push(gameUser.toObject());
    });

    this.sendObjectToUsers(app, {
      type: 'ROOM_USERS_UPDATED',
      payload: { users: gameUsers },
    });
  }

  allRolesFilled() {
    let redMaster = false;
    let redGuesser = false;
    let blueMaster = false;
    let blueGuesser = false;

    this.users.forEach(gameUser => {
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
  }

  sendGameStateToRoom(app) {
    this.sendObjectToUsers(app, {
      type: 'GAME_STATE_UPDATED',
      payload: { game: this.game.currentGameState() },
    });
  }
}

module.exports = Room;
