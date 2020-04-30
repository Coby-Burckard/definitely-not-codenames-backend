class Request {
  constructor(type, data) {
    this.type = type
    this.data = data
  }

  static fromClientData(data) {
    const parsed = JSON.parse(data)

    return new Request(parsed.type)
  }

  toString() {
    JSON.stringify({
      type: this.type,
      data: this.data
    })
  }
}

module.exports = Request