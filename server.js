const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Create a new Socket.io instance

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
// Socket.io connection logic
let players = {

}
io.on("connection", (socket) => {
  players[socket.id] = {
    x: 10*(Math.random()*100),
    y: 10,
    color: "white",
  };
  io.emit("updatePlayers", players);  
  console.log("Player connected:", socket.id);
  socket.emit('connected', { socketId: socket.id });
  socket.on("disconnect", () => {
    console.log("Player disconnected:");
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
