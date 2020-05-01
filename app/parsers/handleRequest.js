const Request = require("../features/Request");
const Room = require("../features/Room");

const handleRequest = ({ rooms }, ws) => (clientData) => {
  const request = Request.fromClientData(clientData);

  if (!request) {
    // the request couldn't be parsed from the client data
    return;
  }

  if (request.type === "CREATE_ROOM") {
    const newRoom = new Room();

    const roomId = newRoom.id;
    rooms.set(newRoom.id, newRoom);

    console.log("created room", roomId);

    const payload = JSON.stringify({
      type: "ROOM_CREATED",
      payload: { id: roomId },
    });

    ws.send(payload);
  }
};

module.exports = handleRequest;
