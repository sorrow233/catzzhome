import { i18n } from '../lib/I18n.js';
import { HERO_CONFIG } from '../config/HeroConfig.js';

export class QuoteWidget {
  constructor(element) {
    this.prefix = element.querySelector('[data-prefix]');
    this.suffix = element.querySelector('[data-suffix]');
    this.index = 0;
    this.timer = null;
    this.reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  start() {
    this.stop();
    this.render();
    if (!this.reducedMotion) this.timer = window.setInterval(() => this.advance(), 6000);
  }

  advance() {
    this.prefix.parentElement.classList.add('is-changing');
    window.setTimeout(() => {
      this.index += 1;
      this.render();
      this.prefix.parentElement.classList.remove('is-changing');
    }, 450);
  }

  render() {
    const quotes = HERO_CONFIG.quotes[i18n.getLocale()] || HERO_CONFIG.quotes.zh;
    this.index %= quotes.prefixes.length;
    this.prefix.textContent = quotes.prefixes[this.index];
    this.suffix.textContent = quotes.suffixes[this.index] || '';
  }

  stop() { if (this.timer) window.clearInterval(this.timer); this.timer = null; }
}
