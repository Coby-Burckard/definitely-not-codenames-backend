const Request = require('../features/Request');
const Room = require('../features/Room');
const Response = require('../features/Response');

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

        existingRoom.users.add(user.id);
        user.roomID = existingRoom.id;

        existingRoom.sendObjectToUsers(app, {
          type: 'ROOM_USERS_UPDATED',
          payload: { users: Array.from(existingRoom.users) },
        });

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
    default:
  }
};

module.exports = handleRequest;
