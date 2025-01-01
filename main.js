import { Point, Rect } from "./JudeUtils.js";
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
class Globals {
    constructor() {
        this.gravity = 0.1;
    }
}
class Player {
    constructor() {
        this.bounds = new Rect(0, 0, 50, 50);
        this.velocity = new Point(0, 0);
    } 
    update() {
        this.velocity.y += Globals.gravity;
        this.bounds.y += this.velocity.y;
        this.bounds.x += this.velocity.x;
        
    }
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.bounds.x, this.bounds.y, this.bounds.w, this.bounds.h);
    }
}

let player = new Player();
function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();

    requestAnimationFrame(loop);
}

function init() {
    loop();
}
init();