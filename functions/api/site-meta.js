import { fetchRemote, parseManifestIcons, parseSiteMetadata, RemoteError, safeRemoteUrl } from '../lib/siteMetadata.js';

export async function onRequestGet({ request }) {
  try {
    const target = safeRemoteUrl(new URL(request.url).searchParams.get('url'));
    if (!target) return json({ error: 'invalid_url' }, 400);
    const page = await fetchRemote(target.href);
    const contentType = page.response.headers.get('content-type') || '';
    const html = new globalThis.TextDecoder().decode(page.bytes);
    if (!/text\/html|application\/xhtml\+xml/i.test(contentType) && !/^\s*(?:<!doctype\s+html|<html|<head)/i.test(html)) return json({ error: 'not_html' }, 415);
    const parsed = parseSiteMetadata(html, page.url);
    let manifestIcons = [];
    if (parsed.manifestUrl && safeRemoteUrl(parsed.manifestUrl)) {
      try {
        const manifest = await fetchRemote(parsed.manifestUrl);
        manifestIcons = parseManifestIcons(new globalThis.TextDecoder().decode(manifest.bytes), manifest.url);
      } catch { /* Document metadata remains useful without its manifest. */ }
    }
    const origin = new URL(page.url).origin;
    return json({ url: page.url, name: parsed.name, icons: [...new Set([...parsed.icons, ...manifestIcons, `${origin}/favicon.ico`])].slice(0, 8) }, 200, { 'Cache-Control': 'public, max-age=3600' });
  } catch (error) {
    return json({ error: error.message || 'metadata_failed' }, error instanceof RemoteError ? error.status : 502);
  }
}

function json(value, status, headers = {}) {
  return new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } });
}
