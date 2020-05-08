const Request = require('../features/Request');
const Room = require('../features/Room');
const Response = require('../features/Response');
const GameUser = require('../features/GameUser');
const payloadValidators = require('../features/payloadValidators');
const gameValidators = require('../features/gameValidators');

const handleRequest = (app, ws, requestUser) => clientData => {
  const request = Request.fromClientData(clientData);

  if (!request) {
    // the request couldn't be parsed from the client data
    return;
  }

  switch (request.type) {
    case 'CREATE_ROOM':
      {
        const newRoom = new Room();
        app.rooms.set(newRoom.id, newRoom);

        requestUser.roomID = newRoom.id;

        ws.send(
          Response.fromObject({
            type: 'ROOM_CREATED',
            payload: { id: newRoom.id },
          })
        );

        console.log('Room created: ', newRoom.id);
      }
      break;
    case 'JOIN_ROOM':
      {
        const existingRoom = app.rooms.get(request.payload.id);
        if (!existingRoom) {
          ws.send(Response.error('Room not found'));
          break;
        }

        existingRoom.users.set(
          requestUser.id,
          GameUser.createWithID(requestUser.id)
        );

        requestUser.roomID = existingRoom.id; // Yes, you can only be in one room

        existingRoom.sendGameUsersToRoom(app);
        existingRoom.sendGameStateToRoom(app);

        console.log('User added to room: ', requestUser.id);
      }
      break;
    case 'SEND_MESSAGE':
      {
        const { message } = request.payload;
        if (!message) {
          ws.send(Response.error('No message to send'));
          break;
        }

        const room = app.rooms.get(requestUser.roomID);
        if (!room) {
          ws.send(Response.error('Room not found'));
          break;
        }

        // Doesn't do anything right now
        room.feed.addMessage(message);

        room.sendObjectToUsers(app, {
          type: 'MESSAGE_RECEIVED',
          payload: { message },
        });
      }
      break;
    case 'ASSIGN_TEAM':
      {
        const { team } = request.payload;
        if (!team || !GameUser.hasTeam(team)) {
          ws.send(Response.error('Team color not found'));
          break;
        }

        const room = app.rooms.get(requestUser.roomID);
        if (!room) {
          ws.send(Response.error('Room not found'));
          break;
        }

        const gameUser = room.users.get(requestUser.id);
        if (!gameUser) {
          ws.send(Response.error('User not found'));
          break;
        }

        gameUser.assignTeam(team);

        room.sendGameUsersToRoom(app);
      }
      break;
    case 'ASSIGN_ROLE':
      {
        const { role } = request.payload;
        if (!role) {
          ws.send(Response.error('Role not found'));
          break;
        }

        const room = app.rooms.get(requestUser.roomID);
        if (!room) {
          ws.send(Response.error('Room not found'));
          break;
        }

        const gameUser = room.users.get(requestUser.id);
        if (!gameUser) {
          ws.send(Response.error('User not found'));
          break;
        }

        gameUser.assignRole(role);

        room.sendGameUsersToRoom(app);
      }
      break;
    case 'ASSIGN_NAME': {
      const { name } = request.payload;
      if (!name) {
        ws.send(Response.error('Name not submitted'));
        break;
      }

      const room = app.rooms.get(requestUser.roomID);
      if (!room) {
        ws.send(Response.error('Room not found'));
        break;
      }

      const gameUser = room.users.get(requestUser.id);
      gameUser.assignName(name);

      room.sendGameUsersToRoom(app);
      break;
    }
    case 'START_GAME': {
      const room = app.rooms.get(requestUser.roomID);
      if (!room) {
        ws.send(Response.error('Room not found'));
        break;
      }

      if (gameValidators.startGameValid(room)) {
        const { game } = room;
        if (!game) {
          ws.send(Response.error('Game not found'));
          break;
        }

        game.initialize();

        room.sendGameStateToRoom(app);
      }

      break;
    }
    case 'START_NEW_GAME': {
      const room = app.rooms.get(requestUser.roomID);
      if (!room) {
        ws.send(Response.error('Room not found'));
        break;
      }

      room.newBlankGame();
      room.sendGameStateToRoom(app);
      break;
    }
    case 'CLICK_CARD': {
      const { i, isValid } = payloadValidators.clickCardPayload(
        request.payload
      );
      if (!isValid) {
        ws.send(Response.error('CLICK_CARD payload not valid'));
        break;
      }

      // obtaining game variables
      const room = app.rooms.get(requestUser.roomID);
      if (!room) {
        ws.send(Response.error('Room not found'));
        break;
      }

      const gameUser = room.users.get(requestUser.id);
      if (!gameUser) {
        ws.send(Response.error('User not found'));
        break;
      }

      const { game } = room;
      if (!game) {
        ws.send(Response.error('Game not found'));
        break;
      }

      // validating click
      if (gameValidators.clickCardValid(game, gameUser, i)) {
        game.touch(i);

        room.sendGameStateToRoom(app);
      }
      break;
    }
    case 'CLICK_PASS': {
      const room = app.rooms.get(requestUser.roomID);
      if (!room) {
        ws.send(Response.error('Room not found'));
        break;
      }

      const gameUser = room.users.get(requestUser.id);
      if (!gameUser) {
        ws.send(Response.error('User not found'));
        break;
      }

      const { game } = room;
      if (!game) {
        ws.send(Response.error('Game not found'));
        break;
      }

      if (gameValidators.clickPassValid(game, gameUser)) {
        game.pass();

        room.sendGameStateToRoom(app);
      }

      break;
    }
    case 'SET_CLUE': {
      const { payload } = request;
      const {
        isValid,
        clueWord,
        clueNumber,
      } = payloadValidators.setCluePayload(payload);

      if (!isValid) {
        ws.send(Response.error('SET_CLUE payload not valid'));
        break;
      }

      const room = app.rooms.get(requestUser.roomID);
      if (!room) {
        ws.send(Response.error('Room not found'));
        break;
      }

      const gameUser = room.users.get(requestUser.id);
      if (!gameUser) {
        ws.send(Response.error('User not found'));
        break;
      }

      const { game } = room;
      if (!game) {
        ws.send(Response.error('Game not found'));
        break;
      }

      if (gameValidators.setClueValid(game, gameUser)) {
        game.setClueWordAndNumber(clueWord, clueNumber);
        game.toggleModeGuessing();

        room.sendGameStateToRoom(app);
      }

      break;
    }
    default:
  }
};

module.exports = handleRequest;
