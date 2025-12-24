export class Raindrop {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.reset();
        this.y = Math.random() * height;
    }

    reset() {
        this.x = Math.random() * this.width;
        this.y = -20;
        this.length = Math.random() * 15 + 5;
        this.speed = Math.random() * 3 + 4;
        this.opacity = Math.random() * 0.3 + 0.1;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y + this.length);
        ctx.strokeStyle = `rgba(148, 163, 184, ${this.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    }

    update() {
        this.y += this.speed;
        if (this.y > this.height) this.reset();
    }
}

export class RainAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d', {
            alpha: true,
            desynchronized: true
        });

        this.dpr = Math.min(window.devicePixelRatio || 1, 1.0);
        this.raindrops = [];
        this.count = 40;
        this.isAnimating = false;
        this.animationId = null;

        this.init();
    }

    init() {
        this.resize();
        for (let i = 0; i < this.count; i++) {
            this.raindrops.push(new Raindrop(this.width, this.height));
        }

        window.addEventListener('resize', () => this.resize());
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';

        // Update raindrops boundaries
        this.raindrops.forEach(drop => {
            drop.width = this.width;
            drop.height = this.height;
        });
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.stop();
        } else {
            this.start();
        }
    }

    start() {
        if (this.isAnimating) return;
        this.isAnimating = true;
        this.animate();
    }

    stop() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    animate() {
        if (!this.isAnimating) return;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.raindrops.forEach(drop => {
            drop.update();
            drop.draw(this.ctx);
        });
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}
