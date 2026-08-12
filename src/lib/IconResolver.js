import { HERO_CONFIG } from '../config/HeroConfig.js';

export class IconResolver {
  constructor(cache) { this.cache = cache; }

  async resolve(bookmark) {
    const cached = await this.cache.get(bookmark.url);
    if (cached) return cached;
    const domain = new URL(bookmark.url).hostname.replace(/^www\./, '');
    const slug = HERO_CONFIG.simpleIconsMap[domain] || bookmark.name.toLowerCase().replace(/[^a-z\d]/g, '');
    const candidates = [
      { src: `https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/${slug}.svg`, mask: true },
      { src: `https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(domain)}`, mask: false }
    ];
    for (const candidate of candidates) {
      if (await loadImage(candidate.src)) {
        const result = { type: 'image', ...candidate, alt: bookmark.name };
        await this.cache.set(bookmark.url, result);
        return result;
      }
    }
    const fallback = { type: 'text', text: bookmark.name.charAt(0).toUpperCase() || '?' };
    await this.cache.set(bookmark.url, fallback);
    return fallback;
  }
}

function loadImage(src, timeout = 5000) {
  return new Promise((resolve) => {
    const image = new Image();
    const timer = window.setTimeout(() => finish(false), timeout);
    const finish = (result) => {
      window.clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
      resolve(result);
    };
    image.onload = () => finish(image.naturalWidth > 4);
    image.onerror = () => finish(false);
    image.src = src;
  });
}
