class GameUser {
  constructor(id) {
    this.id = id;
    this.name = null;
    this.team = null;
    this.role = null;
  }

  static createWithID(id) {
    return new GameUser(id);
  }

  setName(name) {
    this.name = name;
  }

  assignTeamRed() {
    this.team = 'red';
  }

  assignTeamBlue() {
    this.team = 'blue';
  }

  assignRoleMaster() {
    this.role = 'master';
  }

  assignRoleGuesser() {
    this.role = 'guesser';
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      team: this.team,
      role: this.role,
    };
  }
}

module.exports = GameUser;
