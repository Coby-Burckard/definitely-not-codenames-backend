const WebSocket = require('ws');

const PORT = process.env.WS_PORT || 8080

const wss = new WebSocket.Server({ port: PORT });

console.log(`Starting server on port ${PORT}`)

wss.on('connection', function connection(ws) {
  console.log('New connection')

  ws.on('message', function incoming(message) {
    console.log('received from client: ', message);
  });

  ws.send('Im on the server');
});