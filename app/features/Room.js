const uid = require('uid-safe');

const Feed = require('./Feed');

const Response = require('./Response');

class Room {
  constructor() {
    this.id = uid.sync(24);
    this.feed = new Feed();
    this.users = new Map();
  }

  sendObjectToUsers(app, response) {
    this.users.forEach((gameUser, userID) => {
      const roomUserConnection = app.users.get(userID).connection;
      roomUserConnection.send(Response.fromObject(response));
    });
  }

  sendGameUsersToRoom(app) {
    const gameUsers = [];
    this.users.forEach((gameUser, userID) => {
      gameUsers.push(gameUser.toObject());
    });
    this.sendObjectToUsers(app, {
      type: 'ROOM_USERS_UPDATED',
      payload: { users: gameUsers },
    });
  }
}

module.exports = Room;
