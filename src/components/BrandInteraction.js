import { resolveSearchTarget } from '../lib/SearchNavigation.js';

const DOUBLE_ACTIVATION_DELAY = 280;

export class BrandInteraction {
  constructor({ root, openWallpapers, navigate = (url) => location.assign(url) }) {
    this.brand = root.querySelector('[data-brand-trigger]');
    this.search = root.querySelector('[data-quick-search]');
    this.form = root.querySelector('[data-quick-search-form]');
    this.input = root.querySelector('[data-quick-search-input]');
    this.openWallpapers = openWallpapers;
    this.navigate = navigate;
  }

  mount() {
    this.brand.addEventListener('click', () => this.activate());
    this.brand.addEventListener('dblclick', (event) => event.preventDefault());
    this.brand.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || !event.shiftKey) return;
      event.preventDefault();
      this.cancelActivation();
      this.hideSearch();
      this.openWallpapers();
    });
    this.form.addEventListener('submit', (event) => this.submit(event));
    this.input.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      this.hideSearch();
      this.brand.focus();
    });
    document.addEventListener('pointerdown', (event) => {
      if (!this.search.hidden && !this.search.contains(event.target) && !this.brand.contains(event.target)) this.hideSearch();
    });
  }

  activate() {
    if (this.activationTimer) {
      this.cancelActivation();
      this.hideSearch();
      this.openWallpapers();
      return;
    }
    this.activationTimer = window.setTimeout(() => {
      this.activationTimer = null;
      this.showSearch();
    }, DOUBLE_ACTIVATION_DELAY);
  }

  showSearch() {
    window.clearTimeout(this.hideTimer);
    this.search.hidden = false;
    this.brand.setAttribute('aria-expanded', 'true');
    queueMicrotask(() => this.search.classList.add('is-visible'));
    this.input.focus({ preventScroll: true });
  }

  hideSearch() {
    if (this.search.hidden) return;
    this.search.classList.remove('is-visible');
    this.brand.setAttribute('aria-expanded', 'false');
    window.clearTimeout(this.hideTimer);
    this.hideTimer = window.setTimeout(() => { this.search.hidden = true; }, 180);
  }

  submit(event) {
    event.preventDefault();
    const country = document.querySelector('meta[name="catzz-country"]')?.content || '';
    const target = resolveSearchTarget(this.input.value, country);
    if (target) this.navigate(target);
  }

  cancelActivation() {
    window.clearTimeout(this.activationTimer);
    this.activationTimer = null;
  }
}
