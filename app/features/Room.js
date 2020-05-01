const uid = require('uid-safe');

const Feed = require('./Feed');

class Room {
  constructor() {
    this.id = uid.sync(24);
    this.feed = new Feed();
    this.users = new Set();
  }
}

module.exports = Room;