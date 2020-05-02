const uid = require('uid-safe');

const Feed = require('./Feed');

const Response = require('./Response');

class Room {
  constructor() {
    this.id = uid.sync(24);
    this.feed = new Feed();
    this.users = new Set();
  }

  sendToUsers(data, app) {
    this.users.forEach(userID => {
      const roomUserConnection = app.users.get(userID).connection;
      roomUserConnection.send(
        Response.fromObject({
          type: 'ROOM_USERS_UPDATED',
          payload: { data },
        })
      );
    });
  }
}

module.exports = Room;
