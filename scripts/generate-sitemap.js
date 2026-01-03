const fs = require('fs');
const path = require('path');
const SEO_CONFIG = require('../seo-config.js');

const SITE_URL = 'https://catzz.work';
const DIST_DIR = path.join(__dirname, '../dist');

const generateSitemap = () => {
    // Generate distinct URLs for each language to ensure Google indexes them
    // Strategy: Use query parameters as canonical URLs for different languages
    // e.g., https://catzz.work/?lang=en

    let urlEntries = '';

    // Base entry (x-default)
    const languages = SEO_CONFIG.locales;

    // For each language, we create a URL entry
    languages.forEach(lang => {
        const url = `${SITE_URL}/?lang=${lang}`;
        const lastmod = new Date().toISOString().split('T')[0];

        // Hreflang entries for this URL
        const hreflangs = languages.map(l =>
            `        <xhtml:link rel="alternate" hreflang="${SEO_CONFIG.languages[l].lang}" href="${SITE_URL}/?lang=${l}"/>`
        ).join('\n');

        // Add x-default
        const xDefault = `        <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/"/>`;

        urlEntries += `
    <url>
        <loc>${url}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>daily</changefreq>
        <priority>${lang === SEO_CONFIG.defaultLocale ? '1.0' : '0.8'}</priority>
${hreflangs}
${xDefault}
    </url>`;
    });

    // Add root URL entry specifically (often maps to default lang)
    urlEntries += `
    <url>
        <loc>${SITE_URL}/</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
        ${languages.map(l =>
        `<xhtml:link rel="alternate" hreflang="${SEO_CONFIG.languages[l].lang}" href="${SITE_URL}/?lang=${l}"/>`
    ).join('\n')}
        <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/"/>
    </url>`;

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;

    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent);
    console.log('✅ Generated sitemap.xml with multilingual support');
};

const generateRobotsTxt = () => {
    const robotsContent = `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml
`;

    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsContent);
    console.log('✅ Generated robots.txt');
};

try {
    generateSitemap();
    generateRobotsTxt();
} catch (error) {
    console.error('❌ Error generating SEO files:', error);
    process.exit(1);
}

