import SEO_CONFIG, { SITE_URL } from '../seo-config.js';

export function resolveLocale(url, acceptLanguage = '') {
  const requested = new URL(url).searchParams.get('lang');
  if (SEO_CONFIG.locales.includes(requested)) return requested;

  const candidates = acceptLanguage
    .split(',')
    .map((part) => part.trim().split(';')[0])
    .filter(Boolean);

  for (const candidate of candidates) {
    if (SEO_CONFIG.locales.includes(candidate)) return candidate;
    const base = candidate.split('-')[0];
    if (SEO_CONFIG.locales.includes(base)) return base;
  }
  return SEO_CONFIG.defaultLocale;
}

export async function onRequest({ request, next }) {
  const response = await next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return response;

  const locale = resolveLocale(request.url, request.headers.get('Accept-Language') || '');
  const config = SEO_CONFIG.languages[locale];
  const localizedUrl = `${SITE_URL}/?lang=${locale}`;
  const rewriter = new HTMLRewriter()
    .on('html', { element: (element) => element.setAttribute('lang', config.lang) })
    .on('title', { element: (element) => element.setInnerContent(config.title) })
    .on('meta[name="description"]', { element: (element) => element.setAttribute('content', config.description) })
    .on('meta[property="og:title"]', { element: (element) => element.setAttribute('content', config.title) })
    .on('meta[property="og:description"]', { element: (element) => element.setAttribute('content', config.description) })
    .on('meta[property="og:locale"]', { element: (element) => element.setAttribute('content', config.ogLocale) })
    .on('meta[property="og:url"]', { element: (element) => element.setAttribute('content', localizedUrl) })
    .on('meta[name="twitter:title"]', { element: (element) => element.setAttribute('content', config.title) })
    .on('meta[name="twitter:description"]', { element: (element) => element.setAttribute('content', config.description) })
    .on('link[rel="canonical"]', { element: (element) => element.setAttribute('href', localizedUrl) });

  return rewriter.transform(response);
}
