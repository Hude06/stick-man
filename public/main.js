import { Point, Rect } from "./JudeUtils.js";

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let currentKey = new Map();
let socket = io(); // Connect to the Socket.io server

class Globals {
  constructor() {
    this.gravity = 0.3;
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
  constructor(id) {
    this.id = id;
    this.bounds = new Rect(0, 0, 200, 200);
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

  update() {
    this.bounds.y += this.velocity.y;
    this.bounds.x += this.velocity.x;
    this.velocity.x *= 1 - this.resistance;

    if (this.animation == 0) {
      this.sprite = this.idle;
    }
    if (this.animation == 1) {
      this.sprite = this.walking;
    }
    if (this.velocity.x > this.maxSpeed) {
      this.velocity.x = this.maxSpeed;
    } else if (this.velocity.x < -this.maxSpeed) {
      this.velocity.x = -this.maxSpeed;
    }
    if (currentKey.get("d")) {
      this.velocity.x += this.speed;
      this.animation = 1;
    } else if (currentKey.get("a")) {
      this.velocity.x -= this.speed;
      this.animation = 1;
    } else {
      this.animation = 0;
    }
    if (currentKey.get("w")) {  
      this.velocity.y = -10;
    } else if (this.bounds.y + this.bounds.h > 850) {
      this.velocity.y = 0;
    } else {
      this.velocity.y += globals.gravity;
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
        200,
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
        200,
      );
      ctx.restore(); // Restore the context to its original state
    }
  }
}

let globals = new Globals();
let player = new Player("player1"); // You can replace with a dynamic player ID
let players = {};
socket.emit("connection", player.id);


let ground = new Image();
ground.src = "./Assets/ground.png"
// Listen for other players' updates

/*
socket.on("server", (data) => {
  for (let player in data) {
    console.log("JSON IS ", data[player]);
    if (player != socket.id) {
      // console.log(data[player]);
      players[player] = data[player];
    }
  }
});
*/

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;
  player.draw();
  player.update();
  ctx.drawImage(ground, 0, 800, 9000, 1000);
  // Draw other players
  // Emit player position to the server
  socket.emit("playerUpdate", {
    playerID: player.id,
    x: Math.round(player.bounds.x),
    y: Math.round(player.bounds.y),
    XV: Math.round(player.velocity.x),
    YV: Math.round(player.velocity.y),
    frame: player.frame,
  });

  requestAnimationFrame(loop);
}

function init() {
  player.updatePerSecond();
  globals.keyboardInit();
  loop();
}

init();
