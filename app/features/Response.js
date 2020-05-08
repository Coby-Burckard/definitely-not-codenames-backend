class Response {
  constructor(type, payload) {
    this.type = type;
    this.payload = payload;
  }

  static fromObject(obj) {
    const { type, payload } = obj;

    return JSON.stringify({ type, payload });
  }

  static error(type, err) {
    return JSON.stringify({ type: type || 'ERROR', payload: { err } });
  }
}

module.exports = Response;
