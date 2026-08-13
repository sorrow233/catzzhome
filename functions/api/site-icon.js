import { fetchRemote, RemoteError, safeRemoteUrl } from '../lib/siteMetadata.js';

export async function onRequestGet({ request }) {
  try {
    const target = safeRemoteUrl(new URL(request.url).searchParams.get('url'));
    if (!target) return new Response('Invalid icon URL', { status: 400 });
    const icon = await fetchRemote(target.href, { kind: 'icon' });
    const type = icon.response.headers.get('content-type') || '';
    if (!/^image\/(?:png|jpeg|webp|avif|gif|svg\+xml|x-icon|vnd\.microsoft\.icon)/i.test(type)) return new Response('Unsupported icon', { status: 415 });
    return new Response(icon.bytes, { headers: { 'Content-Type': type, 'Cache-Control': 'public, max-age=604800, immutable', 'X-Content-Type-Options': 'nosniff' } });
  } catch (error) {
    return new Response('Icon unavailable', { status: error instanceof RemoteError ? error.status : 502, headers: { 'Cache-Control': 'public, max-age=300' } });
  }
}
