const uid = require('uid-safe');

class User {
  constructor(connection) {
    this.id = uid.sync(8);
    this.connection = connection;
    this.roomID = null;
  }

  static createWithConnection(connection) {
    return new User(connection);
  }
}

module.exports = User;
