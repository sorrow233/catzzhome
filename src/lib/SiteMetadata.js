const CACHE_PREFIX = 'catzz_site_meta:';
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

export class SiteMetadata {
  constructor({ fetcher = fetch } = {}) { this.fetcher = fetcher; this.pending = new Map(); }

  async resolve(rawUrl, { signal } = {}) {
    const url = normalizeUrl(rawUrl);
    if (!url) return null;
    const key = new URL(url).origin;
    const cached = readCache(key);
    if (cached) return cached;
    if (!this.pending.has(key)) this.pending.set(key, this.request(url).finally(() => this.pending.delete(key)));
    return withAbort(this.pending.get(key), signal);
  }

  async request(url, signal) {
    const endpoint = `/api/site-meta?url=${encodeURIComponent(url)}`;
    let lastError;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetchWithTimeout(this.fetcher, endpoint, { signal, timeout: 6500 });
        if (!response.ok) throw new Error(`metadata_${response.status}`);
        const data = await response.json();
        const result = {
          url: normalizeUrl(data.url) || url,
          name: cleanName(data.name, data.url || url),
          icons: [...new Set((Array.isArray(data.icons) ? data.icons : []).map(normalizeUrl).filter(Boolean))].slice(0, 6)
        };
        writeCache(new URL(url).origin, result);
        return result;
      } catch (error) {
        lastError = error;
        if (signal?.aborted) throw error;
        if (attempt === 0) await delay(250);
      }
    }
    throw lastError;
  }
}

export function proxiedIconUrl(url) { return `/api/site-icon?url=${encodeURIComponent(url)}`; }

export function cleanName(value, url) {
  const text = String(value || '').replace(/\s+/g, ' ').trim().replace(/\s+[|·—–-]\s+.+$/, '').slice(0, 40);
  if (text && !/^(home|homepage|index)$/i.test(text)) return text;
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host.split('.')[0].replace(/[-_]+/g, ' ').replace(/^./, (letter) => letter.toUpperCase()).slice(0, 40);
  } catch { return 'Site'; }
}

function normalizeUrl(value) {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
  } catch { return null; }
}

async function fetchWithTimeout(fetcher, url, { signal, timeout }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const abort = () => controller.abort();
  signal?.addEventListener('abort', abort, { once: true });
  try { return await fetcher(url, { signal: controller.signal, headers: { Accept: 'application/json' } }); }
  finally { clearTimeout(timer); signal?.removeEventListener('abort', abort); }
}

function readCache(key) {
  try {
    const value = JSON.parse(localStorage.getItem(`${CACHE_PREFIX}${key}`));
    return value && Date.now() - value.cachedAt < CACHE_TTL ? value.data : null;
  } catch { return null; }
}
function writeCache(key, data) { try { localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({ cachedAt: Date.now(), data })); } catch { /* Memory-only browsing still works. */ } }
function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }
function withAbort(promise, signal) {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(new DOMException('Aborted', 'AbortError'));
  return new Promise((resolve, reject) => {
    const abort = () => reject(new DOMException('Aborted', 'AbortError'));
    signal.addEventListener('abort', abort, { once: true });
    promise.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
  });
}
