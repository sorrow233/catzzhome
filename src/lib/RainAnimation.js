class Drop {
  constructor(width, height) { this.bounds(width, height); this.reset(true); }
  bounds(width, height) { this.width = width; this.height = height; }
  reset(randomY = false) {
    this.x = Math.random() * this.width;
    this.y = randomY ? Math.random() * this.height : -20;
    this.length = Math.random() * 14 + 6;
    this.speed = Math.random() * 3 + 4;
    this.opacity = Math.random() * 0.25 + 0.08;
  }
}

export class RainAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d', { alpha: true, desynchronized: true });
    this.drops = [];
    this.animationId = null;
    this.resize = this.resize.bind(this);
    this.onVisibility = this.onVisibility.bind(this);
  }

  start() {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || this.animationId) return;
    this.resize();
    addEventListener('resize', this.resize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
    this.frame();
  }

  resize() {
    const width = innerWidth;
    const height = innerHeight;
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);
    this.canvas.style.width = `${width}px`;
    this.canvas.style.height = `${height}px`;
    this.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.width = width;
    this.height = height;
    if (!this.drops.length) this.drops = Array.from({ length: Math.min(80, Math.round(width / 15)) }, () => new Drop(width, height));
    else this.drops.forEach((drop) => drop.bounds(width, height));
  }

  frame = () => {
    this.context.clearRect(0, 0, this.width, this.height);
    this.context.lineWidth = 1.1;
    this.context.lineCap = 'round';
    for (const drop of this.drops) {
      drop.y += drop.speed;
      if (drop.y > drop.height) drop.reset();
      this.context.beginPath();
      this.context.moveTo(drop.x, drop.y);
      this.context.lineTo(drop.x, drop.y + drop.length);
      this.context.strokeStyle = `rgba(200, 218, 230, ${drop.opacity})`;
      this.context.stroke();
    }
    this.animationId = requestAnimationFrame(this.frame);
  };

  onVisibility() { document.hidden ? this.pause() : this.resume(); }
  pause() { cancelAnimationFrame(this.animationId); this.animationId = null; }
  resume() { if (!this.animationId) this.frame(); }
  destroy() { this.pause(); removeEventListener('resize', this.resize); document.removeEventListener('visibilitychange', this.onVisibility); }
}
