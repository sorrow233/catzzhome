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
    this.dimensions = new Map();
  }

  async mount(sceneMode = 'manual') {
    this.media = matchMedia('(max-width: 640px)');
    this.media.addEventListener?.('change', () => this.applyPosition());
    this.resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(() => this.applyPosition()) : null;
    this.resizeObserver?.observe(this.element);
    if (this.customWallpaper?.enabled) {
      const blob = await this.assetStore?.get('custom-wallpaper');
      if (blob) return this.setCustom(blob);
    }
    if (sceneMode === 'time') this.selectedId = sceneForHour(new Date().getHours());
    this.element.style.backgroundImage = `url("${this.urls[this.selectedId]}")`;
    this.applyTheme();
    this.rememberDimensions(this.selectedId, this.urls[this.selectedId]);
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
    this.dimensions.set(id, loaded);
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
  async removeCustom() {
    this.revokeCustom();
    this.element.style.backgroundImage = `url("${this.urls[this.selectedId]}")`;
    this.applyTheme();
    this.rememberDimensions(this.selectedId, this.urls[this.selectedId]);
  }
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
    if (!this.media?.matches) {
      this.element.style.backgroundPosition = wallpaper?.position || 'center';
      return;
    }
    const size = this.dimensions.get(this.selectedId);
    this.element.style.backgroundPosition = size
      ? resolveFocalPosition({ ...size, containerWidth: this.element.clientWidth, containerHeight: this.element.clientHeight, focus: wallpaper?.mobileFocus })
      : `${(wallpaper?.mobileFocus?.x ?? 0.5) * 100}% ${(wallpaper?.mobileFocus?.y ?? 0.5) * 100}%`;
  }

  async rememberDimensions(id, url) {
    const loaded = await preload(url);
    if (!loaded || this.selectedId !== id) return;
    this.dimensions.set(id, loaded);
    this.applyPosition();
  }
}

export function resolveFocalPosition({ width, height, containerWidth, containerHeight, focus = { x: 0.5, y: 0.5 } }) {
  if (![width, height, containerWidth, containerHeight].every((value) => Number.isFinite(value) && value > 0)) return '50% 50%';
  const imageRatio = width / height;
  const containerRatio = containerWidth / containerHeight;
  if (imageRatio > containerRatio) {
    const renderedWidth = containerHeight * imageRatio;
    const overflow = renderedWidth - containerWidth;
    const offset = clamp((focus.x ?? 0.5) * renderedWidth - containerWidth / 2, 0, overflow);
    return `${roundPercent(offset / overflow)}% 50%`;
  }
  if (imageRatio < containerRatio) {
    const renderedHeight = containerWidth / imageRatio;
    const overflow = renderedHeight - containerHeight;
    const offset = clamp((focus.y ?? 0.5) * renderedHeight - containerHeight / 2, 0, overflow);
    return `50% ${roundPercent(offset / overflow)}%`;
  }
  return '50% 50%';
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
    image.onload = () => finish({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => finish(false);
    image.src = url;
  });
}

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
function roundPercent(value) { return Math.round(value * 1000) / 10; }
