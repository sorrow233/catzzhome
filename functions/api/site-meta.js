import { fetchRemote, parseManifestIcons, parseSiteMetadata, RemoteError, safeRemoteUrl } from '../lib/siteMetadata.js';

export async function onRequestGet({ request }) {
  try {
    const requested = new URL(request.url).searchParams.get('url');
    const target = safeRemoteUrl(requested);
    if (!target) return json({ error: 'invalid_url' }, 400);
    const page = await fetchRemote(target.href);
    const contentType = page.response.headers.get('content-type') || '';
    const html = new TextDecoder().decode(page.bytes);
    if (!/text\/html|application\/xhtml\+xml/i.test(contentType) && !/^\s*(?:<!doctype\s+html|<html|<head)/i.test(html)) return json({ error: 'not_html' }, 415);
    const parsed = parseSiteMetadata(html, page.url);
    let manifestIcons = [];
    if (parsed.manifestUrl && safeRemoteUrl(parsed.manifestUrl)) {
      try {
        const manifest = await fetchRemote(parsed.manifestUrl);
        manifestIcons = parseManifestIcons(new TextDecoder().decode(manifest.bytes), manifest.url);
      } catch { /* The document metadata remains useful without its manifest. */ }
    }
    const origin = new URL(page.url).origin;
    return json({ url: page.url, name: parsed.name, icons: [...new Set([...parsed.icons, ...manifestIcons, `${origin}/favicon.ico`])].slice(0, 8) }, 200, { 'Cache-Control': 'public, max-age=3600' });
  } catch (error) {
    const status = error instanceof RemoteError ? error.status : 502;
    return json({ error: error.message || 'metadata_failed' }, status);
  }
}

function json(value, status, headers = {}) { return new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers } }); }
