const uid = require('uid-safe');

const Feed = require('./Feed');

const Response = require('./Response');

class Room {
  constructor() {
    this.id = uid.sync(24);
    this.feed = new Feed();
    this.users = new Set();
  }

  sendObjectToUsers(app, response) {
    this.users.forEach(userID => {
      const roomUserConnection = app.users.get(userID).connection;
      roomUserConnection.send(Response.fromObject(response));
    });
  }
}

module.exports = Room;
