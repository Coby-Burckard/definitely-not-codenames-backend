class Feed {
  constructor() {
    this.messages = ['Default'];
  }

  addMessage(content) {
    this.messages.push(content);
  }
}

module.exports = Feed;
