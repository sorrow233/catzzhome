import { Dialog } from './Dialog.js';

const MAX_WALLPAPER_SIZE = 12 * 1024 * 1024;

export class WallpaperGallery {
  constructor({ root, settings, wallpapers, controller, assetStore, onChange, announce }) {
    this.settings = settings;
    this.wallpapers = wallpapers;
    this.controller = controller;
    this.assetStore = assetStore;
    this.onChange = onChange;
    this.announce = announce;
    this.element = root.querySelector('[data-wallpaper-dialog]');
    this.dialog = new Dialog(this.element);
    root.querySelectorAll('[data-open-wallpapers]').forEach((button) => button.addEventListener('click', () => this.open()));
  }

  mount() {
    this.render();
    this.element.querySelector('[data-gallery-cinematic]').addEventListener('change', (event) => {
      this.controller.setCinematic(event.target.checked);
      this.settings.cinematicPrefs = this.controller.cinematicPrefs;
      this.onChange({ cinematicPrefs: this.settings.cinematicPrefs });
    });
    this.element.querySelector('[data-gallery-scene]').addEventListener('change', async (event) => {
      this.settings.preferences.sceneMode = event.target.checked ? 'time' : 'manual';
      this.onChange({ preferences: this.settings.preferences });
      await this.controller.applyScene(this.settings.preferences.sceneMode);
      this.settings.bgId = this.controller.selectedId;
      this.onChange({ bgId: this.settings.bgId });
      this.syncControls();
    });
    this.element.querySelector('[data-gallery-upload]').addEventListener('change', (event) => this.upload(event.target.files[0]));
    this.element.querySelector('[data-gallery-remove]').addEventListener('click', () => this.removeCustom());
    this.syncControls();
  }

  open() { this.syncControls(); this.dialog.open(this.element.querySelector('.wallpaper-choice[aria-pressed="true"]')); }

  render() {
    const grid = this.element.querySelector('[data-wallpaper-gallery]');
    const fragment = document.createDocumentFragment();
    this.wallpapers.forEach((wallpaper) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'wallpaper-choice'; button.dataset.id = wallpaper.id; button.setAttribute('aria-label', wallpaper.name);
      const image = document.createElement('img'); image.src = wallpaper.thumbUrl; image.alt = ''; image.loading = 'lazy'; image.decoding = 'async';
      const label = document.createElement('span'); label.textContent = wallpaper.name;
      button.append(image, label);
      button.addEventListener('click', async () => {
        if (!await this.controller.select(wallpaper.id)) return;
        this.settings.bgId = wallpaper.id;
        this.settings.customWallpaper = { enabled: false, name: '' };
        this.onChange({ bgId: wallpaper.id, customWallpaper: this.settings.customWallpaper });
        this.syncControls();
        this.dialog.close();
      });
      fragment.append(button);
    });
    grid.replaceChildren(fragment);
  }

  async upload(file) {
    if (!file || !file.type.startsWith('image/') || file.size > MAX_WALLPAPER_SIZE) return;
    await this.assetStore.set('custom-wallpaper', file);
    if (!await this.controller.setCustom(file)) return;
    this.settings.customWallpaper = { enabled: true, name: file.name.slice(0, 80) };
    this.onChange({ customWallpaper: this.settings.customWallpaper });
    this.syncControls();
    this.dialog.close();
  }

  async removeCustom() {
    await this.assetStore.delete('custom-wallpaper');
    await this.controller.removeCustom();
    this.settings.customWallpaper = { enabled: false, name: '' };
    this.onChange({ customWallpaper: this.settings.customWallpaper });
    this.syncControls();
  }

  syncControls() {
    this.element.querySelector('[data-gallery-cinematic]').checked = this.controller.getCinematic();
    this.element.querySelector('[data-gallery-scene]').checked = this.settings.preferences.sceneMode === 'time';
    this.element.querySelector('[data-gallery-remove]').disabled = !this.settings.customWallpaper.enabled;
    this.element.querySelectorAll('.wallpaper-choice').forEach((button) => button.setAttribute('aria-pressed', String(!this.settings.customWallpaper.enabled && button.dataset.id === this.controller.selectedId)));
  }
}
