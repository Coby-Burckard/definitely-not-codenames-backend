const Request = require('../features/Request');
const Room = require('../features/Room');
const Response = require('../features/Response');
const GameUser = require('../features/GameUser');

const handleRequest = (app, ws, user) => clientData => {
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

        console.log('created room', newRoom.id);

        user.roomID = newRoom.id;

        ws.send(
          Response.fromObject({
            type: 'ROOM_CREATED',
            payload: { id: newRoom.id },
          })
        );
      }
      break;
    case 'JOIN_ROOM':
      {
        const existingRoom = app.rooms.get(request.payload.id);

        if (!existingRoom) {
          ws.send(Response.error('404'));
          break;
        }

        existingRoom.users.set(user.id, GameUser.createWithID(user.id));
        user.roomID = existingRoom.id;

        existingRoom.sendGameUsersToRoom(app);

        console.log('Added user to room:', user.id);
      }
      break;
    case 'SEND_MESSAGE':
      {
        const room = app.rooms.get(user.roomID);

        const { message } = request.payload;

        if (!message) {
          ws.send(Response.error('30'));
          break;
        }

        // Doesn't do anything right now
        room.feed.addMessage(message);

        console.log(JSON.stringify(room, null, 2));
        room.sendObjectToUsers(app, {
          type: 'MESSAGE_RECEIVED',
          payload: { message },
        });
      }
      break;
    case 'ASSIGN_TEAM':
      {
        const { team } = request.payload;

        if (!team) {
          ws.send(Response.error('32'));
          break;
        }
      }
      break;
    case 'ASSIGN_ROLE':
      {
        const { role } = request.payload;

        if (!role) {
          ws.send(Response.error('98'));
          break;
        }
      }
      break;
    default:
  }
};

module.exports = handleRequest;
