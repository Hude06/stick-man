import { Point, Rect } from "./JudeUtils.js";
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let currentKey = new Map();
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
  constructor() {
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
    this.jumpCooldown = 0;
    // 0 = idle
    // 1 = walking
    // 2 = attacking
    this.animation = 0;
  }
  update() {
    this.jumpCooldown -= 0.0001;
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
      console.log("d");
      this.velocity.x += this.speed;
      this.animation = 1;
    } else if (currentKey.get("a")) {
      console.log("a");
      this.velocity.x -= this.speed;
      this.animation = 1;
    } else {
      this.animation = 0;
    }
    console.log(this.jumpCooldown);
    if (currentKey.get("w")) {
      if (this.jumpCooldown < 0) {
        this.velocity.y = -10;
        this.jumpCooldown = 1;
        console.log("w");
      }
    } else if (this.bounds.y + this.bounds.h > canvas.height) {
      console.log("hit");
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
      // No flip; just draw the sprite normally
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
      // Flip the sprite horizontally
      ctx.save(); // Save the current context state

      // Flip horizontally by scaling with -1, and translate it to correct position
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
        200, // Adjust x to flip correctly
      );

      ctx.restore(); // Restore the context to its original state
    }
  }
}
let globals = new Globals();
let player = new Player();

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw();
  player.update();
  requestAnimationFrame(loop);
}

function init() {
  player.updatePerSecond();
  globals.keyboardInit();
  loop();
}

init();
