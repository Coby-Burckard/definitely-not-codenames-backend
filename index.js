const WebSocket = require("ws");

const PORT = process.env.WS_PORT || 8080;

const wss = new WebSocket.Server({ port: PORT });

const clients = [];

console.log(`Starting server on port ${PORT}`);

wss.on("connection", (ws) => {
  console.log("New connection");

  clients.push(ws);

  ws.on("message", function incoming(message) {
    console.log("received from client: ", message);
    clients.forEach((client) => {
      client.send(message);
    });
  });

  ws.send("Im on the server");
});

wss.on("message", (message) => {
  console.log9;
  ws.send(message);
});
