const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Create a new Socket.io instance

// Serve static files (like your game)
let players = {};
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
// Socket.io connection logic
io.on("connection", (socket) => {
  console.log("New player connected:", socket.id);
  socket.on("playerUpdate", (data) => {
    console.log(data);
  });
  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
