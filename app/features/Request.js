class Request {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }

  static fromClientData(raw) {
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error(`Error: message not valid JSON\n${raw}`);
      return null;
    }

    return new Request(parsed.type, parsed.payload);
  }
}

module.exports = Request;
