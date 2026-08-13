export class WallpaperController {
  constructor({ element, gradient, wallpapers, urls, selectedId, cinematicPrefs, assetStore, customWallpaper }) {
    this.element = element;
    this.gradient = gradient;
    this.wallpapers = wallpapers;
    this.urls = urls;
    this.selectedId = wallpapers.some((item) => item.id === selectedId) ? selectedId : wallpapers[0].id;
    this.cinematicPrefs = cinematicPrefs && typeof cinematicPrefs === 'object' ? cinematicPrefs : {};
    this.assetStore = assetStore;
    this.customWallpaper = customWallpaper;
    this.customUrl = null;
    this.requestId = 0;
  }

  async mount(sceneMode = 'manual') {
    this.media = matchMedia('(max-width: 640px)');
    this.media.addEventListener?.('change', () => this.applyPosition());
    if (this.customWallpaper?.enabled) {
      const blob = await this.assetStore?.get('custom-wallpaper');
      if (blob) return this.setCustom(blob);
    }
    if (sceneMode === 'time') this.selectedId = sceneForHour(new Date().getHours());
    this.element.style.backgroundImage = `url("${this.urls[this.selectedId]}")`;
    this.applyTheme();
  }

  async select(id) {
    const url = this.urls[id];
    if (!url) return false;
    if (id === this.selectedId) {
      if (this.customUrl) await this.removeCustom();
      return true;
    }
    const requestId = ++this.requestId;
    const overlay = document.createElement('div');
    overlay.className = 'wallpaper-transition';
    overlay.style.backgroundImage = `url("${this.wallpapers.find((item) => item.id === id)?.thumbUrl || url}")`;
    this.element.after(overlay);
    requestAnimationFrame(() => overlay.classList.add('is-visible'));
    const loaded = await preload(url);
    if (requestId !== this.requestId) { overlay.remove(); return false; }
    if (!loaded) { overlay.remove(); return false; }
    this.selectedId = id;
    this.revokeCustom();
    this.element.style.backgroundImage = `url("${url}")`;
    this.applyTheme();
    overlay.classList.remove('is-visible');
    window.setTimeout(() => overlay.remove(), 700);
    return true;
  }

  getCinematic() {
    if (typeof this.cinematicPrefs[this.selectedId] === 'boolean') return this.cinematicPrefs[this.selectedId];
    return this.wallpapers.find((item) => item.id === this.selectedId)?.cinematic !== false;
  }

  setCinematic(value) { this.cinematicPrefs[this.selectedId] = Boolean(value); this.applyTheme(); }
  async setCustom(blob) {
    this.revokeCustom();
    this.customUrl = URL.createObjectURL(blob);
    const loaded = await preload(this.customUrl);
    if (!loaded) { this.revokeCustom(); return false; }
    this.element.style.backgroundImage = `url("${this.customUrl}")`;
    this.element.style.backgroundPosition = 'center';
    this.applyTheme();
    return true;
  }
  async removeCustom() { this.revokeCustom(); this.element.style.backgroundImage = `url("${this.urls[this.selectedId]}")`; this.applyTheme(); }
  async applyScene(mode) { if (mode !== 'time') return; return this.select(sceneForHour(new Date().getHours())); }
  revokeCustom() { if (this.customUrl) URL.revokeObjectURL(this.customUrl); this.customUrl = null; }
  applyTheme() {
    const wallpaper = this.wallpapers.find((item) => item.id === this.selectedId);
    const theme = wallpaper?.theme || {};
    const style = document.documentElement.style;
    style.setProperty('--icon-color', theme.iconColor || '#dbeafe');
    style.setProperty('--icon-hover', theme.iconHoverColor || '#ffffff');
    style.setProperty('--glow-color', theme.glowColor || 'rgba(255,255,255,.25)');
    this.gradient.hidden = !this.getCinematic();
    this.applyPosition();
  }

  applyPosition() {
    if (this.customUrl) return;
    const wallpaper = this.wallpapers.find((item) => item.id === this.selectedId);
    this.element.style.backgroundPosition = this.media?.matches ? (wallpaper?.mobilePosition || wallpaper?.position || 'center') : (wallpaper?.position || 'center');
  }
}

export function sceneForHour(hour) {
  if (hour >= 5 && hour < 9) return 'flower_window';
  if (hour >= 9 && hour < 17) return 'white_shirt_girl';
  if (hour >= 17 && hour < 20) return 'sunset_balcony';
  return 'night_view';
}

function preload(url, timeout = 12000) {
  return new Promise((resolve) => {
    const image = new Image();
    const timer = window.setTimeout(() => finish(false), timeout);
    const finish = (result) => { window.clearTimeout(timer); image.onload = null; image.onerror = null; resolve(result); };
    image.onload = () => finish(true);
    image.onerror = () => finish(false);
    image.src = url;
  });
}
