import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import SEO_CONFIG, { SITE_URL } from '../seo-config.js';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(projectRoot, 'public');
const lastModified = process.env.SOURCE_DATE || new Date().toISOString().slice(0, 10);

const alternates = SEO_CONFIG.locales
  .map((locale) => `    <xhtml:link rel="alternate" hreflang="${SEO_CONFIG.languages[locale].lang}" href="${SITE_URL}/?lang=${locale}"/>`)
  .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_URL}/"/>`)
  .join('\n');

const entries = SEO_CONFIG.locales
  .map(
    (locale) => `  <url>
    <loc>${SITE_URL}/?lang=${locale}</loc>
    <lastmod>${lastModified}</lastmod>
${alternates}
  </url>`
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${lastModified}</lastmod>
${alternates}
  </url>
${entries}
</urlset>
`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(path.join(outputDirectory, 'sitemap.xml'), sitemap, 'utf8');
