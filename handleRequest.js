const Request = require('./Request');
const Room = require('./Room');

const handleRequest = ({ rooms }, ws) => clientData => {
  const request = Request.fromClientData(clientData);

  if (!request) {
    // the request couldn't be parsed from the client data
    return;
  }

  if (request.type === 'CREATE_ROOM') {
    const newRoom = new Room();

    const roomId = newRoom.id;
    rooms.set(newRoom.id, newRoom);

    console.log('created room', roomId);

    const message = JSON.stringify({
      type: 'ROOM_CREATED',
      payload: { id: roomId },
    });

    ws.send(message);
  }
};

module.exports = handleRequest;
