const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

// Initialize the app and server
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Store player data (simple example with x, y positions)
let players = {};

// Serve the static files (your game client files)
app.use(express.static("public"));

// When a new player connects
io.on("connection", (socket) => {
  console.log("New player connected: " + socket.id);

  // Add a new player to the game with a random starting position
  players[socket.id] = { x: 100, y: 100 };

  // Send the initial list of players to the new player
  socket.emit("updatePlayers", players);

  // Handle player disconnect
  socket.on("disconnect", () => {
    console.log("Player disconnected: " + socket.id);
    delete players[socket.id];
    io.emit("removePlayer", { id: socket.id });
  });
});

// Start the server
server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
