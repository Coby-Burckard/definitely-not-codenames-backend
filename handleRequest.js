
const Request = require('./Request')
const Room = require('./Room')

const handleRequest = ({ rooms }, ws) => clientData => {
  const request = Request.fromClientData(clientData)
  console.log(request)

  if (request.type === 'CREATE_ROOM') {
    const newRoom = new Room()

    const roomId = newRoom.id
    rooms.set(newRoom.id, newRoom)

    console.log('created room', roomId)
    ws.send('In the handleRequest', roomId)

    return;
  }
}

module.exports = handleRequest