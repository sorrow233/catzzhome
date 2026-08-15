import { i18n } from '../lib/I18n.js';

const localeMap = { zh: 'zh-CN', 'zh-TW': 'zh-TW', en: 'en-US', ja: 'ja-JP', ko: 'ko-KR' };

export class DateTime {
  constructor(root) {
    this.date = root.querySelector('[data-date]');
    this.clock = root.querySelector('[data-clock]');
    this.locale = localeMap[i18n.getLocale()] || 'zh-CN';
  }

  start() {
    this.update();
    this.timer = window.setInterval(() => this.update(), 1000);
  }

  update() {
    const now = new Date();
    this.date.textContent = new Intl.DateTimeFormat(this.locale, { month: 'long', day: 'numeric', weekday: 'short' }).format(now);
    this.clock.textContent = new Intl.DateTimeFormat(this.locale, { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
    this.clock.dateTime = now.toISOString();
  }
}
