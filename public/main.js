import { Point, Rect } from "./JudeUtils.js";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let currentKey = new Map();
let socket = io(); // Connect to the Socket.io server

class Globals {
  constructor() {
    this.gravity = 0.3;  // Define gravity
  }

  keyboardInit() {
    document.addEventListener("keydown", function (e) {
      currentKey.set(e.key, true);
    });
    document.addEventListener("keyup", function (e) {
      currentKey.set(e.key, false);
    });
  }
}

class Player {
  constructor(x, y, id) {
    this.id = id;
    this.bounds = new Rect(x, y, 200, 200);
    this.velocity = new Point(0, 0);
    this.sprite = new Image();
    this.idle = new Image();
    this.idle.src = "./Assets/Idle/thickIdleSheet.png";
    this.walking = new Image();
    this.walking.src = "./Assets/Run/thickRunSheet.png";
    this.frame = 1;
    this.speed = 1;
    this.maxSpeed = 10;
    this.resistance = 0.3;
    this.animation = 0;
  }

  keyboard() {
    console.log("keyboard");
    // Handle horizontal movement (left-right)
    if (currentKey.get("d")) {
      socket.emit("keydown", "d");
      // this.velocity.x += this.speed;
    } else if (currentKey.get("a")) {
      // this.velocity.x -= this.speed;
      socket.emit("keydown", "a");
    }

    // Handle jumping (upwards velocity)
    if (currentKey.get("w") && this.bounds.y + this.bounds.h >= canvas.height) {
      this.velocity.y = -10; // Apply an upward force
    }
  }

  applyGravity() {
    // Apply gravity continuously in the update loop
    if (this.bounds.y + this.bounds.h < 800) {
      // Only apply gravity if the player is above the ground
      this.velocity.y += globals.gravity;
    } else {
      // Prevent the player from falling below the ground level
      this.velocity.y = 0;
      this.bounds.y = canvas.height - this.bounds.h; // Ensure the player stays on the ground
    }
  }

  update() {
    // Update position based on velocity
    this.bounds.y += this.velocity.y;
    this.bounds.x += this.velocity.x;
    this.velocity.x *= 1 - this.resistance;

    // Apply gravity after updating position
    this.applyGravity();

    // Animation logic
    if (this.animation == 0) {
      this.sprite = this.idle;
    }
    if (this.animation == 1) {
      this.sprite = this.walking;
    }

    // Clamp velocity to max speed
    if (this.velocity.x > this.maxSpeed) {
      this.velocity.x = this.maxSpeed;
    } else if (this.velocity.x < -this.maxSpeed) {
      this.velocity.x = -this.maxSpeed;
    }
  }

  updatePerSecond() {
    setInterval(() => {
      this.frame++;
      if (this.frame > 4) {
        this.frame = 1;
      }
    }, 1000 / 10);
  }

  draw() {
    if (this.velocity.x > 0) {
      ctx.drawImage(
        this.sprite,
        this.frame * 64,
        0,
        64,
        64,
        this.bounds.x,
        this.bounds.y,
        200,
        200
      );
    } else {
      ctx.save(); // Save the current context state
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.sprite,
        this.frame * 64,
        0,
        64,
        64,
        -this.bounds.x - 200,
        this.bounds.y,
        200,
        200
      );
      ctx.restore(); // Restore the context to its original state
    }
  }
}

let globals = new Globals();
let players = {};
let mySocketId = null;

let ground = new Image();
ground.src = "./Assets/ground.png"

socket.emit("connection");

socket.on("updatePlayers", (backendPlayers) => {
  // Add players to the `players` object when the server sends them
  for (const id in backendPlayers) {
    const backendPlayer = backendPlayers[id];
    if (!players[id]) {
      players[id] = new Player(backendPlayer.x, backendPlayer.y, backendPlayer.id);
    } else {
      // Update the player's position if it already exists
      players[id].bounds.x = backendPlayer.x;
      // players[id].bounds.y = backendPlayer.y;
    }
  }
});

socket.on("connected", (data) => {
  console.log("My socket ID is:", data.socketId);
  mySocketId = data.socketId; // Save the socket ID when you receive it
  // Optionally, create your player only now that you have the socket ID
  if (!players[mySocketId]) {
    // You can initialize your player here or in the `updatePlayers` event
    players[mySocketId] = new Player(0, 0, mySocketId);  // Initial position can be set here
  }
});

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.imageSmoothingEnabled = false;
  ctx.shadowBlur = 20;
 ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
 ctx.drawImage(ground, 0, 800, 9000, 1000);

  // Ensure that the player exists before attempting to call its methods

  console.log(mySocketId, players[mySocketId]);
  if (mySocketId && players[mySocketId]) {
    const currentPlayer = players[mySocketId];
    currentPlayer.keyboard(); // Handle keyboard input
    currentPlayer.update();   // Update the player's position and velocity
    currentPlayer.draw();     // Draw the player
  }

  // Draw other players (if there are any other players)
  for (const id in players) {
    if (id !== mySocketId) {
      const otherPlayer = players[id];
      otherPlayer.draw();
      otherPlayer.update();
    }
  }

  requestAnimationFrame(loop);
}

function init() {
  globals.keyboardInit();
  loop();
}

init();
