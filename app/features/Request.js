class Request {
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }

  static fromClientData(data) {
    let parsed;

    try {
      parsed = JSON.parse(data);
    } catch (e) {
      console.error(`Error: message not valid JSON\n${data}`);
      return null;
    }

    return new Request(parsed.type);
  }

  toString() {
    JSON.stringify({
      type: this.type,
      data: this.data,
    });
  }
}

module.exports = Request;
