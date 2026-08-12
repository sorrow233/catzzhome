export const MAX_BOOKMARKS = 24;

import { createId } from './id.js';

export function normalizeBookmark(input) {
  const name = String(input?.name || '').trim().slice(0, 40);
  let rawUrl = String(input?.url || '').trim();
  if (rawUrl && !/^[a-z][a-z\d+.-]*:/i.test(rawUrl)) rawUrl = `https://${rawUrl}`;
  let parsed;
  try { parsed = new URL(rawUrl); } catch { return { ok: false, error: 'invalid_url' }; }
  if (!['http:', 'https:'].includes(parsed.protocol)) return { ok: false, error: 'invalid_url' };
  if (!name) return { ok: false, error: 'invalid_name' };
  return { ok: true, value: { id: String(input?.id || createId('bookmark')).slice(0, 80), name, url: parsed.href.slice(0, 2048), groupId: String(input?.groupId || 'favorites').slice(0, 80) } };
}

export function importBookmarkHtml(html) {
  const document = new DOMParser().parseFromString(html, 'text/html');
  const headings = [...document.querySelectorAll('h3')];
  const groups = new Map([['favorites', 'Favorites']]);
  const bookmarks = [...document.querySelectorAll('a[href]')].flatMap((link) => {
    const href = link.getAttribute('href');
    const heading = headings.findLast((candidate) => candidate.compareDocumentPosition(link) & Node.DOCUMENT_POSITION_FOLLOWING);
    const folder = heading?.textContent?.trim() || 'Imported';
    const groupId = `group_${slug(folder)}`;
    groups.set(groupId, folder.slice(0, 30));
    const result = normalizeBookmark({ name: link.textContent.trim() || deriveName(href), url: href, groupId });
    return result.ok ? [result.value] : [];
  }).slice(0, MAX_BOOKMARKS);
  return { bookmarks, groups: [...groups].map(([id, name]) => ({ id, name })) };
}

function slug(value) { return value.toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, '_').replace(/^_|_$/g, '').slice(0, 36) || createId('imported'); }

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
