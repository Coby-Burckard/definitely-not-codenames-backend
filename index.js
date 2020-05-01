const WebSocket = require('ws');

const handleRequest = require('./handleRequest');

const PORT = process.env.WS_PORT || 8080;

const wss = new WebSocket.Server({ port: PORT });

const clients = [];

console.log(`Starting server on port ${PORT}`);

const app = {
  rooms: new Map(),
};

wss.on('connection', ws => {
  console.log('New connection');

  clients.push(ws);

  ws.on('message', handleRequest(app, ws));

  ws.send('Im on the server');
});
