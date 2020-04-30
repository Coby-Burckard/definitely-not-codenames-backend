const uid = require('uid-safe')

const Feed = require('./feed')

class Room {
  constructor() {
    this.id = uid.sync(24)
    this.feed = new Feed()
  }
}

module.exports = Room