const RED = 'RED';
const BLUE = 'BLUE';

const GUESSER = 'GUESSER';
const MASTER = 'MASTER';

const teamColors = new Set([RED, BLUE]);
const roles = new Set([GUESSER, MASTER]);

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

  static hasTeam(teamColor) {
    return teamColors.has(teamColor);
  }

  static hasRole(role) {
    return roles.has(role);
  }

  setName(name) {
    this.name = name;
  }

  assignTeam(team) {
    if (teamColors.has(team)) {
      this.team = team;
    }
  }

  assignRole(role) {
    if (roles.has(role)) {
      this.role = role;
    }
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
