import SEO_CONFIG from '../seo-config.js';

export async function onRequest(context) {
    const { request, next } = context;
    const url = new URL(request.url);
    const userAgent = request.headers.get('User-Agent') || '';

    // Check if it's a crawler
    const isCrawler = /bot|google|baidu|bing|msn|duckduckgo|teoma|slurp|yandex/i.test(userAgent);

    // Pass through if not a crawler and not explicitly asking for a language resource
    // (Optimization: we could inject for humans too, but client-side hydration usually handles that.
    // However, for best first paint, injecting for everyone is fine, but let's stick to the prompt's focus on SEO/Crawlers first
    // to match "Edge Injection" strategy strictly or generally.)
    // *Strategy Decision*: The user wants "static HTML seen by machines matches React content".
    // It's safest to inject for EVERYONE so the initial HTML is correct before React hydrates.
    // This avoids "flash of wrong content" and fully solves the "empty shell" issue.

    const response = await next();

    // Only process HTML responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
        return response;
    }

    // Detect Language
    // 1. Check URL query param ?lang=xx
    // 2. Check Accept-Language header
    // 3. Fallback to default
    let targetLang = SEO_CONFIG.defaultLocale;

    const queryLang = url.searchParams.get('lang');
    if (queryLang && SEO_CONFIG.locales.includes(queryLang)) {
        targetLang = queryLang;
    } else {
        // Simple Accept-Language check for root visits
        const acceptLang = request.headers.get('Accept-Language');
        if (acceptLang) {
            const preferred = acceptLang.split(',')[0].split('-')[0]; // simple parser
            if (SEO_CONFIG.locales.includes(preferred)) {
                targetLang = preferred;
            }
        }
    }

    // Get Config
    const config = SEO_CONFIG.languages[targetLang] || SEO_CONFIG.languages[SEO_CONFIG.defaultLocale];

    // Rewrite HTML
    // We use HTMLRewriter for streaming transformation - fast and efficient at the edge
    return new HTMLRewriter()
        .on('title', {
            element(element) {
                element.setInnerContent(config.title);
            }
        })
        .on('meta[name="description"]', {
            element(element) {
                element.setAttribute('content', config.description);
            }
        })
        .on('meta[name="keywords"]', {
            element(element) {
                element.setAttribute('content', config.keywords);
            }
        })
        .on('meta[property="og:title"]', {
            element(element) {
                element.setAttribute('content', config.title);
            }
        })
        .on('meta[property="og:description"]', {
            element(element) {
                element.setAttribute('content', config.description);
            }
        })
        .on('meta[property="og:locale"]', {
            element(element) {
                element.setAttribute('content', config.ogLocale);
            }
        })
        .on('html', {
            element(element) {
                element.setAttribute('lang', config.lang);
            }
        })
        // Inject Canonical and Hreflangs dynamically if not present or replace them
        // For simplicity, we assume they exist and we might strictly overwrite or append.
        // But for this task, the static index.html already has placeholders. 
        // We will stick to the basic meta replacement as requested.
        .transform(response);
}
