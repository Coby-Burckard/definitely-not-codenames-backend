const WebSocket = require("ws");

const handleRequest = require("./app/parsers/handleRequest");

// intializing websocket
const PORT = process.env.WS_PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });
console.log(`Starting server on port ${PORT}`);

//initializing memory
const clients = [];

const app = {
  rooms: new Map(),
};

wss.on("connection", (ws) => {
  console.log("New connection");

  clients.push(ws);

  ws.on("message", handleRequest(app, ws));
});
