export const MAX_BOOKMARKS = 24;

export function normalizeBookmark(input) {
  const name = String(input?.name || '').trim().slice(0, 40);
  let rawUrl = String(input?.url || '').trim();
  if (rawUrl && !/^[a-z][a-z\d+.-]*:/i.test(rawUrl)) rawUrl = `https://${rawUrl}`;
  let parsed;
  try { parsed = new URL(rawUrl); } catch { return { ok: false, error: 'invalid_url' }; }
  if (!['http:', 'https:'].includes(parsed.protocol)) return { ok: false, error: 'invalid_url' };
  if (!name) return { ok: false, error: 'invalid_name' };
  const iconUrl = safeIconUrl(input?.iconUrl);
  return { ok: true, value: { name, url: parsed.href.slice(0, 2048), ...(iconUrl ? { iconUrl } : {}) } };
}

function safeIconUrl(value) {
  if (!value) return '';
  try {
    const url = new URL(String(value));
    return ['http:', 'https:'].includes(url.protocol) ? url.href.slice(0, 2048) : '';
  } catch {
    return '';
  }
}

export function sanitizeBookmarks(items, fallback = []) {
  if (!Array.isArray(items)) return fallback;
  const seen = new Set();
  return items.slice(0, MAX_BOOKMARKS).flatMap((item) => {
    const result = normalizeBookmark(item);
    if (!result.ok || seen.has(result.value.url)) return [];
    seen.add(result.value.url);
    return [result.value];
  });
}

export function deriveName(url) {
  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '');
    return hostname.split('.')[0].replace(/^./, (letter) => letter.toUpperCase());
  } catch { return ''; }
}
