import { Dialog } from './Dialog.js';
import { i18n } from '../lib/I18n.js';

export class WallpaperPicker {
  constructor({ root, wallpapers, activeId, cinematic, onWallpaper, onCinematic }) {
    this.root = root;
    this.wallpapers = wallpapers;
    this.activeId = activeId;
    this.onWallpaper = onWallpaper;
    this.onCinematic = onCinematic;
    this.dialog = new Dialog(root.querySelector('[data-wallpaper-dialog]'));
    this.grid = root.querySelector('[data-wallpaper-grid]');
    this.toggle = root.querySelector('[data-cinematic]');
    this.toggle.checked = cinematic;
    this.render();
    root.querySelector('[data-open-wallpapers]').addEventListener('click', () => this.open());
    this.toggle.addEventListener('change', () => this.onCinematic(this.toggle.checked));
    root.querySelector('[data-language]').addEventListener('change', (event) => {
      i18n.setLanguage(event.target.value);
      const url = new URL(location.href);
      url.searchParams.set('lang', event.target.value);
      location.assign(url);
    });
  }

  render() {
    const fragment = document.createDocumentFragment();
    for (const wallpaper of this.wallpapers) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'wallpaper-choice';
      button.dataset.id = wallpaper.id;
      button.setAttribute('aria-pressed', String(wallpaper.id === this.activeId));
      button.setAttribute('aria-label', wallpaper.name);
      const image = document.createElement('img');
      image.src = wallpaper.thumbUrl;
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      const label = document.createElement('span');
      label.textContent = wallpaper.name;
      button.append(image, label);
      button.addEventListener('click', async () => {
        await this.onWallpaper(wallpaper.id);
        this.setActive(wallpaper.id);
        this.dialog.close();
      });
      fragment.append(button);
    }
    this.grid.append(fragment);
  }

  open() { this.dialog.open(this.grid.querySelector('[aria-pressed="true"]')); }
  setActive(id) {
    this.activeId = id;
    this.grid.querySelectorAll('.wallpaper-choice').forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.id === id)));
  }
  setCinematic(value) { this.toggle.checked = value; }
}
