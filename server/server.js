const express = require("express");
const { Server } = require("socket.io");
const http = require("http");
const handleSocket = require("./handleSocket");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: "*" });
const rooms = new Map();
const port = process.env.PORT || 8080;

handleSocket(io, rooms);

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
