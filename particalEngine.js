export class ParticleEngine {
    constructor(ctx, options = {}) {
        this.ctx = ctx;
        this.color = options.color || 'white';
        this.size = options.size || 5;
        this.count = options.count || 10;
        this.duration = options.duration || 1; // in seconds
        this.gravity = options.gravity || 0; // gravity effect on particles
        this.particles = [];
        this.spawnParticles(options.initialX || 0, options.initialY || 0);
    }

    spawnParticles(x, y,r,g,b) {
        for (let i = 0; i < this.count; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const speed = Math.random() * 2 + 1;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: this.size * (Math.random() * 0.5 + 0.5), // Randomize size
                life: Math.random() * this.duration,
                maxLife: this.duration,
                r: r,
                g: g,
                b: b
            });
        }
    }

    update(deltaTime) {
        // Update particle positions and apply gravity
        this.particles.forEach(particle => {
            if (particle.life > 0) {
                particle.vy += this.gravity * deltaTime; // Apply gravity
                particle.x += particle.vx * deltaTime;
                particle.y += particle.vy * deltaTime;
                particle.life -= deltaTime;
            }
        });

        // Remove dead particles
        this.particles = this.particles.filter(particle => particle.life > 0);
    }

    draw() {
        this.ctx.save(); // Save current state to restore later
        this.particles.forEach(particle => {
            const alpha = particle.life / particle.maxLife; // Fade effect
            this.ctx.fillStyle = `rgba(${particle.r},${particle.g},${particle.b},${alpha})`;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.restore(); // Restore saved state
    }
}
