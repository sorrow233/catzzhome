export class WallpaperController {
  constructor({ element, gradient, wallpapers, urls, selectedId, cinematicPrefs }) {
    this.element = element;
    this.gradient = gradient;
    this.wallpapers = wallpapers;
    this.urls = urls;
    this.selectedId = wallpapers.some((item) => item.id === selectedId) ? selectedId : wallpapers[0].id;
    this.cinematicPrefs = cinematicPrefs && typeof cinematicPrefs === 'object' ? cinematicPrefs : {};
    this.requestId = 0;
  }

  mount() {
    this.element.style.backgroundImage = `url("${this.urls[this.selectedId]}")`;
    this.applyTheme();
  }

  async select(id) {
    const url = this.urls[id];
    if (!url || id === this.selectedId) return true;
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
    this.element.style.backgroundImage = `url("${url}")`;
    this.applyTheme();
    overlay.classList.remove('is-visible');
    window.setTimeout(() => overlay.remove(), 700);
    return true;
  }

  getCinematic() {
    if (typeof this.cinematicPrefs[this.selectedId] === 'boolean') return this.cinematicPrefs[this.selectedId];
    return !['rainy_window', 'sunset_balcony', 'night_view'].includes(this.selectedId);
  }

  setCinematic(value) { this.cinematicPrefs[this.selectedId] = Boolean(value); this.applyTheme(); }
  applyTheme() {
    const wallpaper = this.wallpapers.find((item) => item.id === this.selectedId);
    const theme = wallpaper?.theme || {};
    const style = document.documentElement.style;
    style.setProperty('--icon-color', theme.iconColor || '#dbeafe');
    style.setProperty('--icon-hover', theme.iconHoverColor || '#ffffff');
    style.setProperty('--glow-color', theme.glowColor || 'rgba(255,255,255,.25)');
    this.gradient.hidden = !this.getCinematic();
  }
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
