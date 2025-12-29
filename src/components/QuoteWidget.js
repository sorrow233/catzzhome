import { i18n } from '../lib/I18n.js';
import { HERO_CONFIG } from '../config/HeroConfig.js';

export class QuoteWidget {
    constructor(containerElement) {
        this.container = containerElement;
        this.quotes = HERO_CONFIG.quotes;
        this.currentIndex = 0;
        this.interval = null;
    }

    mount() {
        if (!this.container) return;

        // Find expected child elements
        this.prefixEl = this.container.querySelector('.prefix');
        this.quotesEl = this.container.querySelector('.typed-quotes');

        if (!this.prefixEl || !this.quotesEl) return;

        this.start();
    }

    start() {
        const lang = i18n.getLocale();
        const quotes = this.quotes[lang] || this.quotes['zh'];
        const prefixes = quotes.prefixes;
        const suffixes = quotes.suffixes;

        this.prefixEl.textContent = prefixes[0];
        this.quotesEl.textContent = suffixes[0];

        this.prefixEl.classList.remove('text-out');
        this.quotesEl.classList.remove('text-out');
        this.prefixEl.classList.add('text-prefix-in');
        this.quotesEl.classList.add('text-quotes-in');

        if (this.interval) clearInterval(this.interval);

        this.interval = setInterval(() => {
            this.prefixEl.classList.replace('text-prefix-in', 'text-out');
            this.quotesEl.classList.replace('text-quotes-in', 'text-out');

            setTimeout(() => {
                this.currentIndex = (this.currentIndex + 1) % prefixes.length;
                this.prefixEl.textContent = prefixes[this.currentIndex];
                this.quotesEl.textContent = suffixes[this.currentIndex];
                this.prefixEl.classList.replace('text-out', 'text-prefix-in');
                this.quotesEl.classList.replace('text-out', 'text-quotes-in');
            }, 1200);
        }, 5000);
    }

    stop() {
        if (this.interval) clearInterval(this.interval);
    }
}
