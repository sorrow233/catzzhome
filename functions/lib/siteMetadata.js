const MAX_HTML_BYTES = 600_000;
const MAX_ICON_BYTES = 1_500_000;

export function safeRemoteUrl(value) {
  let url;
  try { url = new URL(value); } catch { return null; }
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.port) return null;
  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, '');
  if (!hostname || hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local') || hostname.endsWith('.internal') || hostname.endsWith('.test') || hostname.endsWith('.invalid')) return null;
  if (hostname.includes(':') || /^\d+$/.test(hostname) || /^0x/i.test(hostname) || isPrivateIpv4(hostname)) return null;
  return url;
}

export function parseSiteMetadata(html, pageUrl) {
  const url = new URL(pageUrl);
  const meta = extractTags(html, 'meta');
  const links = extractTags(html, 'link');
  const title = firstText([
    metaValue(meta, 'property', 'og:site_name'),
    metaValue(meta, 'name', 'application-name'),
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1],
    metaValue(meta, 'property', 'og:title')
  ]);
  const icons = links
    .filter((attrs) => /(?:^|\s)(?:shortcut\s+)?icon(?:\s|$)|apple-touch-icon/i.test(attrs.rel || ''))
    .map((attrs) => absoluteUrl(attrs.href, url))
    .filter(Boolean);
  const manifest = links.find((attrs) => /(?:^|\s)manifest(?:\s|$)/i.test(attrs.rel || ''));
  return {
    name: decodeHtml(title).replace(/\s+/g, ' ').trim(),
    icons: [...new Set(icons)],
    manifestUrl: absoluteUrl(manifest?.href, url)
  };
}

export function parseManifestIcons(value, manifestUrl) {
  try {
    const manifest = JSON.parse(value);
    return (Array.isArray(manifest.icons) ? manifest.icons : []).map((icon) => absoluteUrl(icon?.src, new URL(manifestUrl))).filter(Boolean);
  } catch { return []; }
}

export async function fetchRemote(startUrl, { kind = 'html', fetcher = fetch } = {}) {
  let current = safeRemoteUrl(startUrl);
  if (!current) throw new RemoteError('unsafe_url', 400);
  for (let redirect = 0; redirect < 4; redirect += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6000);
    let response;
    try {
      response = await fetcher(current, {
        redirect: 'manual', signal: controller.signal,
        headers: { Accept: kind === 'icon' ? 'image/avif,image/webp,image/png,image/svg+xml,image/*;q=.8,*/*;q=.1' : 'text/html,application/xhtml+xml,application/manifest+json,application/json;q=.8' }
      });
    } finally { clearTimeout(timer); }
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const next = safeRemoteUrl(new URL(response.headers.get('location') || '', current).href);
      if (!next) throw new RemoteError('unsafe_redirect', 400);
      current = next;
      continue;
    }
    if (!response.ok) throw new RemoteError(`upstream_${response.status}`, 502);
    const limit = kind === 'icon' ? MAX_ICON_BYTES : MAX_HTML_BYTES;
    const declared = Number(response.headers.get('content-length'));
    if (declared > limit) throw new RemoteError('response_too_large', 413);
    const bytes = new Uint8Array(await response.arrayBuffer());
    if (bytes.byteLength > limit) throw new RemoteError('response_too_large', 413);
    return { response, bytes, url: current.href };
  }
  throw new RemoteError('too_many_redirects', 502);
}

export class RemoteError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

function extractTags(html, tag) {
  return [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, 'gi'))].map((match) => Object.fromEntries([...match[1].matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g)].map((attr) => [attr[1].toLowerCase(), attr[2] ?? attr[3] ?? attr[4] ?? ''])));
}
function metaValue(items, attribute, value) { return items.find((item) => item[attribute]?.toLowerCase() === value)?.content || ''; }
function firstText(items) { return items.find((item) => String(item || '').trim()) || ''; }
function absoluteUrl(value, base) { try { const url = new URL(value, base); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } }
function decodeHtml(value) { return String(value || '').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))); }
function isPrivateIpv4(hostname) {
  if (!/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) return false;
  const parts = hostname.split('.').map(Number);
  if (parts.some((part) => part > 255)) return true;
  const [a, b] = parts;
  return a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 0 || b === 168)) || (a === 198 && (b === 18 || b === 19));
}
