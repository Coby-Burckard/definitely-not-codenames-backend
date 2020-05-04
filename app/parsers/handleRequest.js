const Request = require('../features/Request');
const Room = require('../features/Room');
const Response = require('../features/Response');
const GameUser = require('../features/GameUser');

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
      const gameUser = room.users.get(requestUser.id);
      gameUser.assignName(name);

      room.sendGameUsersToRoom(app);
      break;
    }
    case 'START_GAME': {
      const room = app.rooms.get(requestUser.roomID);

      if (!room.allRolesFilled()) {
        console.log('Not all roles filled - not starting game');
        return;
      }

      const { game } = room;
      game.initialize();

      room.sendGameStateToRoom(app);
      break;
    }
    default:
  }
};

module.exports = handleRequest;
