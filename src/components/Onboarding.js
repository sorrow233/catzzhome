import { Dialog } from './Dialog.js';

export class Onboarding {
  constructor({ root, settings, onComplete, enableWeather }) {
    this.element = root.querySelector('[data-onboarding]');
    this.settings = settings;
    this.onComplete = onComplete;
    this.enableWeather = enableWeather;
    this.dialog = new Dialog(this.element);
  }

  mount() {
    if (this.settings.onboardingComplete) return;
    this.element.querySelector('[data-onboarding-later]').addEventListener('click', () => this.finish(false));
    this.element.querySelector('[data-onboarding-complete]').addEventListener('click', () => this.finish(true));
    this.dialog.open(this.element.querySelector('[data-onboarding-engine]'));
  }

  async finish(configure) {
    if (configure) {
      this.settings.search.engine = this.element.querySelector('[data-onboarding-engine]').value;
      if (this.element.querySelector('[data-onboarding-weather]').checked) await this.enableWeather();
    }
    this.settings.onboardingComplete = true;
    this.onComplete({ onboardingComplete: true, search: this.settings.search, weather: this.settings.weather });
    this.dialog.close();
  }
}
