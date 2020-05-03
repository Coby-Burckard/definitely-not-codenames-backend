const WebSocket = require('ws');
const express = require('express');

const Response = require('./app/features/Response');
const User = require('./app/features/User');

const handleRequest = require('./app/parsers/handleRequest');
const handleClose = require('./app/parsers/handleClose');

// initializing express server
const PORT = process.env.PORT || 8080;
const INDEX = '/index.js';
const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => {
    console.log('express listening on port', PORT);
  });

// intializing websocket
const wss = new WebSocket.Server({ server });
console.log(`Starting server on port ${PORT}`);

const app = {
  rooms: new Map(),
  users: new Map(),
};

wss.on('connection', ws => {
  console.log('New connection. Creating user...');

  const user = User.createWithConnection(ws);
  app.users.set(user.id, user);

  // Send user id to client
  ws.send(
    Response.fromObject({
      type: 'USER_CREATED',
      payload: {
        id: user.id,
      },
    })
  );

  ws.on('message', handleRequest(app, ws, user));

  ws.on('close', handleClose(app, ws, user));
});
