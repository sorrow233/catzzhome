import { i18n } from '../lib/I18n.js';
import { fetchWeather, requestPosition, weatherSymbol } from '../lib/WeatherService.js';

export class ClockWeather {
  constructor({ root, settings, onChange, announce }) {
    this.clock = root.querySelector('[data-clock]');
    this.date = root.querySelector('[data-date]');
    this.weather = root.querySelector('[data-weather]');
    this.settings = settings;
    this.onChange = onChange;
    this.announce = announce;
    this.weather.addEventListener('click', () => this.handleClick());
  }

  start() {
    this.renderTime();
    this.timer = window.setInterval(() => this.renderTime(), 1000);
    if (this.settings.weather.enabled) this.refreshWeather();
  }

  renderTime() {
    const now = new Date();
    const locale = i18n.getLocale();
    this.clock.dateTime = now.toISOString();
    this.clock.textContent = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
    this.date.textContent = new Intl.DateTimeFormat(locale, { month: 'long', day: 'numeric', weekday: 'long' }).format(now);
  }

  async enableWeather() {
    try {
      const position = await requestPosition();
      this.settings.weather = { ...this.settings.weather, ...position, enabled: true };
      await this.refreshWeather();
      this.onChange({ weather: this.settings.weather });
      return true;
    } catch (error) {
      console.warn('Location request failed', error);
      this.announce(i18n.t('location_denied'));
      return false;
    }
  }

  async handleClick() {
    if (this.pending) return;
    if (this.settings.weather.enabled) return this.refreshWeather();
    this.pending = true; this.weather.setAttribute('aria-busy', 'true');
    try { await this.enableWeather(); }
    finally { this.pending = false; this.weather.removeAttribute('aria-busy'); }
  }

  async refreshWeather() {
    const { latitude, longitude } = this.settings.weather;
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return;
    this.abort?.abort();
    this.abort = new AbortController();
    try {
      const current = await fetchWeather({ latitude, longitude }, this.abort.signal);
      this.weather.textContent = `${weatherSymbol(current.code)} ${current.temperature}°`;
      this.weather.hidden = false;
    } catch (error) {
      if (error.name !== 'AbortError') console.warn('Weather request failed', error);
    }
  }

  stop() { window.clearInterval(this.timer); this.abort?.abort(); }
}
