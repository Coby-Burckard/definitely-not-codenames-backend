const WebSocket = require('ws');

const Response = require('./app/features/Response');
const User = require('./app/features/User');

const handleRequest = require('./app/parsers/handleRequest');
const handleClose = require('./app/parsers/handleClose');

// intializing websocket
const PORT = 80;
const wss = new WebSocket.Server({ port: PORT });
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
