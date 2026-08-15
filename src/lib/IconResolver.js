import { HERO_CONFIG } from '../config/HeroConfig.js';
import { proxiedIconUrl } from './SiteMetadata.js';

export class IconResolver {
  constructor(cache, metadata) {
    this.cache = cache;
    this.metadata = metadata;
  }

  async resolve(bookmark, { refresh = false } = {}) {
    if (!refresh) {
      const cached = await this.cache.get(bookmark.url);
      if (cached) return cached;
    }
    const url = new URL(bookmark.url);
    const domain = url.hostname.replace(/^www\./, '');
    const declared = bookmark.iconUrl ? [bookmark.iconUrl] : await this.declaredIcons(bookmark.url);
    const knownSlug = HERO_CONFIG.simpleIconsMap[domain];
    const candidates = [
      ...declared.map((src) => ({ src: proxiedIconUrl(src), mask: false })),
      ...(knownSlug ? [{ src: `https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/${knownSlug}.svg`, mask: true }] : []),
      { src: `https://www.google.com/s2/favicons?sz=128&domain_url=${encodeURIComponent(url.origin)}`, mask: false },
      { src: proxiedIconUrl(new URL('/favicon.ico', url).href), mask: false }
    ];
    const candidate = await firstValid(candidates);
    if (candidate) {
      const result = { type: 'image', ...candidate, alt: bookmark.name };
      await this.cache.set(bookmark.url, result);
      return result;
    }
    const fallback = { type: 'text', text: bookmark.name.charAt(0).toUpperCase() || '?' };
    await this.cache.set(bookmark.url, fallback);
    return fallback;
  }

  async declaredIcons(url) {
    if (!this.metadata) return [];
    try { return (await this.metadata.resolve(url))?.icons || []; }
    catch { return []; }
  }
}

async function firstValid(candidates) {
  const unique = [...new Map(candidates.map((item) => [item.src, item])).values()].slice(0, 10);
  const checks = await Promise.all(unique.map(async (candidate) => ({ candidate, valid: await loadImage(candidate.src) })));
  return checks.find((item) => item.valid)?.candidate || null;
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
    image.referrerPolicy = 'no-referrer';
    image.src = src;
  });
}
