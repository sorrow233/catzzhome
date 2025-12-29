const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://catzz.work';
const DIST_DIR = path.join(__dirname, '../dist');

// Define your routes here
const routes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    // Add more routes if you create multi-page architecture later
];

const generateSitemap = () => {
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${routes.map(route => `
    <url>
        <loc>${SITE_URL}${route.path}</loc>
        <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>${route.changefreq}</changefreq>
        <priority>${route.priority}</priority>
    </url>
    `).join('')}
</urlset>`;

    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapContent);
    console.log('✅ Generated sitemap.xml');
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

// Run
try {
    generateSitemap();
    generateRobotsTxt();
} catch (error) {
    console.error('❌ Error generating SEO files:', error);
    process.exit(1);
}
